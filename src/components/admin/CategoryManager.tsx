import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Category, CloudProvider, Question, DifficultyLevel } from '../../types';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  Cloud, 
  Boxes, 
  Code2, 
  Server, 
  Globe, 
  ShieldCheck, 
  DollarSign, 
  Eye, 
  Edit, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  FolderTree, 
  Tag, 
  Save, 
  Layers,
  Upload,
  Download,
  FileText,
  Sparkles,
  FolderPlus,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories: initialCategories, questions, setQuestions } = useApp();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // Selected category for Inspection / Editing
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeSubcategoryFilter, setActiveSubcategoryFilter] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState<{
    name: string;
    cloud: CloudProvider;
    description: string;
    subcategories: string[];
    newSubcatInput: string;
  }>({
    name: '',
    cloud: 'AWS',
    description: '',
    subcategories: [],
    newSubcatInput: ''
  });

  // Create New Category Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCatFormData, setNewCatFormData] = useState<{
    name: string;
    cloud: CloudProvider;
    description: string;
    subcategoriesStr: string;
  }>({
    name: '',
    cloud: 'AWS',
    description: '',
    subcategoriesStr: 'Compute, Security, Networking'
  });

  // Category Question Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importTab, setImportTab] = useState<'form' | 'csv'>('form');
  const [importFormData, setImportFormData] = useState<{
    cloud: CloudProvider;
    category: string;
    difficulty: DifficultyLevel;
    subcategory: string;
    title: string;
    previewAnswer: string;
    fullAnswer: string;
  }>({
    cloud: 'AWS',
    category: 'AWS Cloud Architecture',
    difficulty: 'Intermediate',
    subcategory: 'General',
    title: '',
    previewAnswer: '',
    fullAnswer: ''
  });

  const [importCsvText, setImportCsvText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileStats, setUploadedFileStats] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleOpenImportModal = (targetCategory?: Category) => {
    setIsCustomCategory(false);
    setIsCustomSubcategory(false);
    setUploadedFileName(null);
    setUploadedFileStats(null);
    if (targetCategory) {
      setImportFormData(prev => ({
        ...prev,
        cloud: targetCategory.cloud,
        category: targetCategory.name,
        subcategory: targetCategory.subcategories[0] || 'General'
      }));
    } else if (selectedCategory) {
      setImportFormData(prev => ({
        ...prev,
        cloud: selectedCategory.cloud,
        category: selectedCategory.name,
        subcategory: selectedCategory.subcategories[0] || 'General'
      }));
    } else if (categories.length > 0) {
      setImportFormData(prev => ({
        ...prev,
        cloud: categories[0].cloud,
        category: categories[0].name,
        subcategory: categories[0].subcategories[0] || 'General'
      }));
    }
    setIsImportModalOpen(true);
  };

  const handleSingleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFormData.title.trim() || !importFormData.previewAnswer.trim() || !importFormData.fullAnswer.trim()) {
      alert('Please fill out all required question fields.');
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cloud: importFormData.cloud,
      category: importFormData.category,
      subcategory: importFormData.subcategory || 'General',
      difficulty: importFormData.difficulty,
      title: importFormData.title.trim(),
      previewAnswer: importFormData.previewAnswer.trim(),
      fullAnswer: importFormData.fullAnswer.trim(),
      realWorldExample: `Production architecture scenario for ${importFormData.title.trim()}`,
      commonMistakes: [
        'Overlooking high availability & failover considerations',
        'Inadequate metric monitoring & IAM security policies'
      ],
      followUpQuestions: [
        {
          id: `fq-${Date.now()}-1`,
          question: `How would you configure zero-downtime rollouts for this?`,
          expectedAnswerHint: `Mention deployment strategy like Blue/Green or Canary releases.`
        }
      ],
      targetExperience: importFormData.difficulty === 'Advanced' ? '5-8 Years' : importFormData.difficulty === 'Intermediate' ? '3-5 Years' : '1-2 Years',
      isLocked: false,
      viewsCount: 1,
      bookmarksCount: 0,
      sharesCount: 0,
      signupsConverted: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'Published'
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setIsImportModalOpen(false);
    setImportFormData(prev => ({
      ...prev,
      title: '',
      previewAnswer: '',
      fullAnswer: ''
    }));
    showNotification(`Successfully imported question "${newQuestion.title}" into ${newQuestion.category}!`);
  };

  const handleCsvImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCsvText.trim()) return;

    const lines = importCsvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let dataLines = lines;
    if (lines[0].toLowerCase().includes('cloud provider') || lines[0].toLowerCase().includes('question title')) {
      dataLines = lines.slice(1);
    }

    const importedList: Question[] = [];

    dataLines.forEach((line, idx) => {
      const columns = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(col => col.replace(/^"(.*)"$/, '$1').trim());
      
      if (columns.length >= 5) {
        const cloudStr = (columns[0] as CloudProvider) || importFormData.cloud;
        const catStr = columns[1] || importFormData.category;
        const diffStr = (columns[2] as DifficultyLevel) || 'Intermediate';
        const subcatStr = columns[3] || 'General';
        const titleStr = columns[4] || `Imported Question #${idx + 1}`;
        const previewStr = columns[5] || 'Short summary preview teaser answer.';
        const fullStr = columns[6] || previewStr;

        const newQ: Question = {
          id: `q-csv-${Date.now()}-${idx}`,
          cloud: cloudStr,
          category: catStr,
          difficulty: diffStr,
          subcategory: subcatStr,
          title: titleStr,
          previewAnswer: previewStr,
          fullAnswer: fullStr,
          realWorldExample: `Production case study for ${titleStr}`,
          commonMistakes: ['Lack of automated testing', 'Suboptimal security configuration'],
          followUpQuestions: [
            {
              id: `fq-${Date.now()}-${idx}`,
              question: 'What are the performance implications of this setup?',
              expectedAnswerHint: 'Evaluate latency, network bandwidth, and memory allocation.'
            }
          ],
          targetExperience: diffStr === 'Advanced' ? '5-8 Years' : diffStr === 'Intermediate' ? '3-5 Years' : '1-2 Years',
          isLocked: false,
          viewsCount: 1,
          bookmarksCount: 0,
          sharesCount: 0,
          signupsConverted: 0,
          publishedAt: new Date().toISOString().split('T')[0],
          status: 'Published'
        };

        importedList.push(newQ);
      }
    });

    if (importedList.length > 0) {
      setQuestions(prev => [...importedList, ...prev]);
      setIsImportModalOpen(false);
      setImportCsvText('');
      showNotification(`Successfully imported ${importedList.length} question(s) via CSV!`);
    } else {
      alert('Could not parse any valid questions from the CSV text. Please check the column formatting.');
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvHeader = "Cloud Provider,Category,Difficulty,Subcategory,Question Title,Short Answer (Public Teaser),Detailed Interview Answer\n";
    const sampleRow1 = `"AWS","AWS Cloud Architecture","Intermediate","Networking & VPC","What is VPC Peering vs AWS Transit Gateway?","VPC Peering connects two VPCs directly, while Transit Gateway acts as a central hub for hundreds of VPCs and VPNs.","AWS VPC Peering is a 1-to-1 non-transitive connection between two virtual private clouds. Transit Gateway (TGW) serves as a regional router hub connecting VPCs, VPNs, and Direct Connects with scalable routing domain isolation."\n`;
    const sampleRow2 = `"Kubernetes","Kubernetes Architecture","Advanced","Control Plane","How does the Kubernetes API Server enforce RBAC?","The API Server validates authentication tokens, then checks Role/ClusterRole bindings before admitting requests.","When a request hits kube-apiserver, it first passes through Authentication plugins (X.509 certs, OIDC), then Authorization checks via RBAC policy rules. If permitted, it moves through Admission Controllers before persisting state to etcd."\n`;

    const blob = new Blob([csvHeader + sampleRow1 + sampleRow2], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloudforge_category_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Sample CSV template downloaded!');
  };

  const handleDownloadSampleJson = () => {
    const sampleJson = [
      {
        "Cloud Provider": "AWS",
        "Category": "AWS Cloud Architecture",
        "Difficulty": "Intermediate",
        "Subcategory": "Networking & VPC",
        "Question Title": "What is VPC Peering vs AWS Transit Gateway?",
        "Short Answer (Public Teaser)": "VPC Peering connects two VPCs directly, while Transit Gateway acts as a central hub for hundreds of VPCs and VPNs.",
        "Detailed Interview Answer": "AWS VPC Peering is a 1-to-1 non-transitive connection between two virtual private clouds. Transit Gateway (TGW) serves as a regional router hub connecting VPCs, VPNs, and Direct Connects with scalable routing domain isolation."
      },
      {
        "Cloud Provider": "Kubernetes",
        "Category": "Kubernetes Architecture",
        "Difficulty": "Advanced",
        "Subcategory": "Control Plane",
        "Question Title": "How does the Kubernetes API Server enforce RBAC?",
        "Short Answer (Public Teaser)": "The API Server validates authentication tokens, then checks Role/ClusterRole bindings before admitting requests.",
        "Detailed Interview Answer": "When a request hits kube-apiserver, it first passes through Authentication plugins (X.509 certs, OIDC), then Authorization checks via RBAC policy rules. If permitted, it moves through Admission Controllers before persisting state to etcd."
      }
    ];

    const blob = new Blob([JSON.stringify(sampleJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloudforge_category_import_template.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Sample JSON template downloaded!');
  };

  const handleDownloadSampleXlsx = () => {
    const sampleData = [
      [
        "Cloud Provider",
        "Category",
        "Difficulty",
        "Subcategory",
        "Question Title",
        "Short Answer (Public Teaser)",
        "Detailed Interview Answer"
      ],
      [
        "AWS",
        "AWS Cloud Architecture",
        "Intermediate",
        "Networking & VPC",
        "What is VPC Peering vs AWS Transit Gateway?",
        "VPC Peering connects two VPCs directly, while Transit Gateway acts as a central hub for hundreds of VPCs and VPNs.",
        "AWS VPC Peering is a 1-to-1 non-transitive connection between two virtual private clouds. Transit Gateway (TGW) serves as a regional router hub connecting VPCs, VPNs, and Direct Connects with scalable routing domain isolation."
      ],
      [
        "Kubernetes",
        "Kubernetes Architecture",
        "Advanced",
        "Control Plane",
        "How does the Kubernetes API Server enforce RBAC?",
        "The API Server validates authentication tokens, then checks Role/ClusterRole bindings before admitting requests.",
        "When a request hits kube-apiserver, it first passes through Authentication plugins (X.509 certs, OIDC), then Authorization checks via RBAC policy rules. If permitted, it moves through Admission Controllers before persisting state to etcd."
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Category Questions");
    XLSX.writeFile(wb, "cloudforge_category_import_template.xlsx");
    showNotification('Sample Excel (.xlsx) template downloaded!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const fileNameLower = file.name.toLowerCase();

    if (fileNameLower.endsWith('.xlsx') || fileNameLower.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (rawRows.length > 0) {
            const formattedCsvLines = rawRows
              .filter(row => row && row.length > 0)
              .map(row => {
                return row.map((cell: any) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',');
              });

            setImportCsvText(formattedCsvLines.join('\n'));
            const recCount = formattedCsvLines.length > 1 && (formattedCsvLines[0].toLowerCase().includes('cloud provider') || formattedCsvLines[0].toLowerCase().includes('question title'))
              ? formattedCsvLines.length - 1
              : formattedCsvLines.length;

            setUploadedFileStats(`Loaded ${recCount} row(s) from Excel file (${(file.size / 1024).toFixed(1)} KB)`);
            showNotification(`Parsed Excel spreadsheet ${file.name}`);
          }
        } catch (err) {
          alert('Error reading Excel spreadsheet file. Please verify file integrity.');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      if (fileNameLower.endsWith('.json')) {
        try {
          const jsonArray = JSON.parse(text);
          if (Array.isArray(jsonArray)) {
            const formattedCsvLines = jsonArray.map((item: any) => {
              const cloud = item.cloud || item['Cloud Provider'] || 'AWS';
              const cat = item.category || item['Category'] || 'AWS Cloud Architecture';
              const diff = item.difficulty || item['Difficulty'] || 'Intermediate';
              const sub = item.subcategory || item['Subcategory'] || 'General';
              const title = item.title || item['Question Title'] || '';
              const preview = item.previewAnswer || item['Short Answer (Public Teaser)'] || item.preview || '';
              const full = item.fullAnswer || item['Detailed Interview Answer'] || item.full || preview;

              const clean = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
              return `${clean(cloud)},${clean(cat)},${clean(diff)},${clean(sub)},${clean(title)},${clean(preview)},${clean(full)}`;
            });

            setImportCsvText(formattedCsvLines.join('\n'));
            setUploadedFileStats(`Loaded ${jsonArray.length} record(s) from JSON file (${(file.size / 1024).toFixed(1)} KB)`);
            showNotification(`Parsed ${jsonArray.length} items from ${file.name}`);
          }
        } catch (err) {
          alert('Invalid JSON file format. Please upload a valid JSON array of question objects.');
        }
      } else {
        setImportCsvText(text);
        const lineCount = text.split('\n').filter(l => l.trim()).length;
        setUploadedFileStats(`Loaded ${lineCount} row(s) from CSV/TXT file (${(file.size / 1024).toFixed(1)} KB)`);
        showNotification(`Loaded ${file.name}`);
      }
    };

    reader.readAsText(file);
  };

  const getCategoryIcon = (cloud: CloudProvider) => {
    switch (cloud) {
      case 'AWS': return <Cloud className="w-5 h-5 text-amber-400" />;
      case 'Kubernetes': return <Boxes className="w-5 h-5 text-blue-400" />;
      case 'Docker': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Helm': return <Layers className="w-5 h-5 text-blue-400" />;
      case 'ArgoCD': return <Layers className="w-5 h-5 text-orange-400" />;
      case 'Jenkins': return <Layers className="w-5 h-5 text-rose-400" />;
      case 'SRE': return <Eye className="w-5 h-5 text-emerald-400" />;
      case 'Observability': return <Eye className="w-5 h-5 text-teal-400" />;
      case 'Terraform': return <Code2 className="w-5 h-5 text-purple-400" />;
      case 'Azure': return <Server className="w-5 h-5 text-cyan-400" />;
      case 'GCP': return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'DevSecOps': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      case 'FinOps': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      default: return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleOpenCategoryDetails = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveSubcategoryFilter(null);
    setIsEditing(false);
    setEditFormData({
      name: cat.name,
      cloud: cat.cloud,
      description: cat.description,
      subcategories: [...cat.subcategories],
      newSubcatInput: ''
    });
  };

  const handleAddSubcategory = () => {
    if (!editFormData.newSubcatInput.trim()) return;
    if (editFormData.subcategories.includes(editFormData.newSubcatInput.trim())) return;
    
    setEditFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, prev.newSubcatInput.trim()],
      newSubcatInput: ''
    }));
  };

  const handleRemoveSubcategory = (subToRemove: string) => {
    setEditFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subToRemove)
    }));
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    const updatedCategory: Category = {
      ...selectedCategory,
      name: editFormData.name,
      cloud: editFormData.cloud,
      description: editFormData.description,
      subcategories: editFormData.subcategories
    };

    setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c));
    setSelectedCategory(updatedCategory);
    setIsEditing(false);
    showNotification(`Category "${updatedCategory.name}" updated successfully!`);
  };

  const handleCreateNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSubcats = newCatFormData.subcategoriesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      cloud: newCatFormData.cloud,
      name: newCatFormData.name,
      description: newCatFormData.description,
      questionCount: 0,
      subcategories: parsedSubcats.length > 0 ? parsedSubcats : ['General'],
      iconName: 'Cloud'
    };

    setCategories(prev => [newCategory, ...prev]);
    setIsAddModalOpen(false);
    setNewCatFormData({
      name: '',
      cloud: 'AWS',
      description: '',
      subcategoriesStr: 'Compute, Security, Networking'
    });
    showNotification(`New Category "${newCategory.name}" created successfully!`);
  };

  // Find linked questions for selected category
  const linkedQuestions: Question[] = selectedCategory 
    ? questions.filter(q => 
        q.cloud.toLowerCase() === selectedCategory.cloud.toLowerCase() || 
        q.category.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
        (selectedCategory.cloud === 'AWS' && ((q.cloud as string) === 'Amazon Web Services' || q.category.toLowerCase().includes('aws')))
      )
    : [];

  const filteredLinkedQuestions = activeSubcategoryFilter
    ? linkedQuestions.filter(q => q.subcategory?.toLowerCase() === activeSubcategoryFilter.toLowerCase())
    : linkedQuestions;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-400" />
            <span>Hierarchical Category Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any category card to inspect subcategories, manage taxonomy tags, and view linked interview questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenImportModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>Import Questions</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => {
          const catLower = cat.name.toLowerCase();
          const count = (catLower === 'amazon web services' || catLower === 'aws')
            ? questions.filter(q => q.cloud === 'AWS' || (q.cloud as string) === 'Amazon Web Services' || q.category.toLowerCase().includes('aws') || q.category.toLowerCase().includes('amazon')).length
            : questions.filter(q => {
                const qCat = (q.category || '').toLowerCase();
                const qSub = (q.subcategory || '').toLowerCase();
                if (qCat === catLower || qSub === catLower) return true;
                if (qCat.length > 2 && catLower.includes(qCat)) return true;
                if (catLower.length > 2 && qCat.includes(catLower)) return true;
                return q.cloud === cat.cloud;
              }).length || cat.questionCount;

          return (
            <div 
              key={cat.id} 
              onClick={() => handleOpenCategoryDetails(cat)}
              className="glass-card bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 p-6 rounded-3xl space-y-4 cursor-pointer group transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/40 transition-colors">
                      {getCategoryIcon(cat.cloud)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{cat.cloud}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                    {count} Questions
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    Subcategories ({cat.subcategories.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map(sub => (
                      <span 
                        key={sub} 
                        className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-md font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect & View Details
                  </span>
                  <span>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: INSPECT & EDIT CATEGORY DRAWER                  */}
      {/* ======================================================== */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-3xl w-full rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Inspector Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  {getCategoryIcon(selectedCategory.cloud)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">{selectedCategory.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                      {selectedCategory.cloud}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedCategory.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenImportModal(selectedCategory)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Questions</span>
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isEditing
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Category'}</span>
                </button>
              </div>
            </div>

            {/* EDIT CATEGORY FORM */}
            {isEditing ? (
              <form onSubmit={handleSaveCategoryEdit} className="space-y-5 text-xs bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  <span>Update Category Settings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Category Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Cloud Provider</label>
                    <select
                      value={editFormData.cloud}
                      onChange={e => setEditFormData({ ...editFormData, cloud: e.target.value as CloudProvider })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="AWS">AWS</option>
                      <option value="Kubernetes">Kubernetes</option>
                      <option value="Docker">Docker</option>
                      <option value="Helm">Helm</option>
                      <option value="ArgoCD">ArgoCD</option>
                      <option value="Jenkins">Jenkins</option>
                      <option value="SRE">SRE</option>
                      <option value="Observability">Observability</option>
                      <option value="Terraform">Terraform</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">GCP</option>
                      <option value="DevSecOps">DevSecOps</option>
                      <option value="FinOps">FinOps</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Subcategories Editor */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-300 block">Manage Subcategories</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFormData.subcategories.map(sub => (
                      <span key={sub} className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg font-medium flex items-center gap-1.5">
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(sub)}
                          className="hover:text-rose-400 text-slate-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add subcategory (e.g. Identity Management)"
                      value={editFormData.newSubcatInput}
                      onChange={e => setEditFormData({ ...editFormData, newSubcatInput: e.target.value })}
                      className="flex-grow px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Category Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE: SUBCATEGORIES & LINKED QUESTIONS */
              <div className="space-y-6">
                
                {/* Subcategories Filter Pills */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Taxonomy Subcategories ({selectedCategory.subcategories.length})</span>
                    {activeSubcategoryFilter && (
                      <button
                        onClick={() => setActiveSubcategoryFilter(null)}
                        className="text-indigo-400 hover:underline text-[11px] font-normal"
                      >
                        Reset Filter (Show All)
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveSubcategoryFilter(null)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeSubcategoryFilter === null
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                      }`}
                    >
                      All ({linkedQuestions.length})
                    </button>

                    {selectedCategory.subcategories.map(sub => {
                      const subCount = linkedQuestions.filter(q => q.subcategory?.toLowerCase() === sub.toLowerCase()).length;
                      return (
                        <button
                          key={sub}
                          onClick={() => setActiveSubcategoryFilter(sub)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeSubcategoryFilter === sub
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span>{sub}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Linked Interview Questions Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      <span>Linked Interview Questions ({filteredLinkedQuestions.length})</span>
                    </h4>
                  </div>

                  {filteredLinkedQuestions.length > 0 ? (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {filteredLinkedQuestions.map(q => (
                        <div key={q.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-200">{q.title}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="text-indigo-400 font-mono">{q.id}</span>
                              <span>•</span>
                              <span>{q.subcategory || 'General'}</span>
                              <span>•</span>
                              <span className="text-slate-400">{q.targetExperience}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            q.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                      No questions found for the selected subcategory filter.
                    </div>
                  )}
                </div>

              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD NEW CATEGORY MODAL                          */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-3xl border border-slate-800 p-6 space-y-5 relative">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>Add New Cloud Category</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Create a new interview question domain taxonomy.</p>
            </div>

            <form onSubmit={handleCreateNewCategory} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serverless & Event-Driven"
                  value={newCatFormData.name}
                  onChange={e => setNewCatFormData({ ...newCatFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Cloud Ecosystem</label>
                <select
                  value={newCatFormData.cloud}
                  onChange={e => setNewCatFormData({ ...newCatFormData, cloud: e.target.value as CloudProvider })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AWS">AWS</option>
                  <option value="Kubernetes">Kubernetes</option>
                  <option value="Docker">Docker</option>
                  <option value="Helm">Helm</option>
                  <option value="ArgoCD">ArgoCD</option>
                  <option value="Jenkins">Jenkins</option>
                  <option value="SRE">SRE</option>
                  <option value="Observability">Observability</option>
                  <option value="Terraform">Terraform</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="DevSecOps">DevSecOps</option>
                  <option value="FinOps">FinOps</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief description of interview topics covered..."
                  value={newCatFormData.description}
                  onChange={e => setNewCatFormData({ ...newCatFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Initial Subcategories (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Lambda, EventBridge, SQS, SNS"
                  value={newCatFormData.subcategoriesStr}
                  onChange={e => setNewCatFormData({ ...newCatFormData, subcategoriesStr: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CATEGORY QUESTION IMPORT MODAL                  */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Bulk & Single Data Ingestion</span>
              </div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-400" />
                <span>Import Category Interview Questions</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Import questions directly into your taxonomy with custom cloud providers, categories, difficulties, and full interview answers.
              </p>
            </div>

            {/* TABS: Form Mode vs CSV Mode */}
            <div className="flex border-b border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setImportTab('form')}
                className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
                  importTab === 'form'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Single Question Form</span>
              </button>
              <button
                type="button"
                onClick={() => setImportTab('csv')}
                className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
                  importTab === 'csv'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Bulk CSV / Text Batch Import</span>
              </button>
            </div>

            {importTab === 'form' ? (
              /* FORM MODE - 7 FIELDS REQUIRED BY USER */
              <form onSubmit={handleSingleImportSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field 1: Cloud Provider */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">1. Cloud Provider *</label>
                    <select
                      value={importFormData.cloud}
                      onChange={e => setImportFormData({ ...importFormData, cloud: e.target.value as CloudProvider })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="AWS">AWS</option>
                      <option value="Kubernetes">Kubernetes</option>
                      <option value="Docker">Docker</option>
                      <option value="Helm">Helm</option>
                      <option value="ArgoCD">ArgoCD</option>
                      <option value="Jenkins">Jenkins</option>
                      <option value="SRE">SRE</option>
                      <option value="Observability">Observability</option>
                      <option value="Terraform">Terraform</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">GCP</option>
                      <option value="DevSecOps">DevSecOps</option>
                      <option value="FinOps">FinOps</option>
                    </select>
                  </div>

                  {/* Field 2: Category */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">2. Category *</label>
                    <select
                      value={isCustomCategory ? '__custom__' : importFormData.category}
                      onChange={e => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                          setImportFormData(prev => ({ ...prev, category: '' }));
                        } else {
                          setIsCustomCategory(false);
                          const newCatName = e.target.value;
                          const foundCat = categories.find(c => c.name === newCatName);
                          setImportFormData(prev => ({
                            ...prev,
                            category: newCatName,
                            subcategory: foundCat?.subcategories[0] || 'General'
                          }));
                          setIsCustomSubcategory(false);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} ({cat.cloud})
                        </option>
                      ))}
                      <option value="__custom__">+ Enter Custom Category...</option>
                    </select>

                    {isCustomCategory && (
                      <input
                        type="text"
                        required
                        placeholder="Type custom category name..."
                        value={importFormData.category}
                        onChange={e => setImportFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full mt-1.5 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field 3: Difficulty */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">3. Difficulty *</label>
                    <select
                      value={importFormData.difficulty}
                      onChange={e => setImportFormData({ ...importFormData, difficulty: e.target.value as DifficultyLevel })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Field 4: Subcategory */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">4. Subcategory *</label>
                    {(() => {
                      const selectedCatObj = categories.find(c => c.name.toLowerCase() === importFormData.category.toLowerCase() || c.cloud === importFormData.cloud);
                      const availableSubcatList = selectedCatObj && selectedCatObj.subcategories.length > 0
                        ? selectedCatObj.subcategories
                        : Array.from(new Set(categories.flatMap(c => c.subcategories)));

                      return (
                        <>
                          <select
                            value={isCustomSubcategory ? '__custom__' : importFormData.subcategory}
                            onChange={e => {
                              if (e.target.value === '__custom__') {
                                setIsCustomSubcategory(true);
                                setImportFormData(prev => ({ ...prev, subcategory: '' }));
                              } else {
                                setIsCustomSubcategory(false);
                                setImportFormData(prev => ({ ...prev, subcategory: e.target.value }));
                              }
                            }}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
                          >
                            {availableSubcatList.map(sub => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                            <option value="__custom__">+ Enter Custom Subcategory...</option>
                          </select>

                          {isCustomSubcategory && (
                            <input
                              type="text"
                              required
                              placeholder="Type custom subcategory name..."
                              value={importFormData.subcategory}
                              onChange={e => setImportFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                              className="w-full mt-1.5 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                            />
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Field 5: Question Title */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">5. Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How do you design multi-region disaster recovery on AWS?"
                    value={importFormData.title}
                    onChange={e => setImportFormData({ ...importFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Field 6: Short Answer (Public Teaser) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">6. Short Answer (Public Teaser) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 2-3 sentence overview visible before unlocking full details..."
                    value={importFormData.previewAnswer}
                    onChange={e => setImportFormData({ ...importFormData, previewAnswer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Field 7: Detailed Interview Answer */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">7. Detailed Interview Answer *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Comprehensive production-grade answer with architectural breakdown, trade-offs, and best practices..."
                    value={importFormData.fullAnswer}
                    onChange={e => setImportFormData({ ...importFormData, fullAnswer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Question</span>
                  </button>
                </div>
              </form>
            ) : (
              /* CSV / JSON / FILE BATCH MODE */
              <form onSubmit={handleCsvImportSubmit} className="space-y-5 text-xs">
                
                {/* Header Banner & Download Templates */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Supported Column Headers (7 Fields):</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadSampleXlsx}
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-all"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Excel (.xlsx) Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadSampleCsv}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadSampleJson}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-all"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>JSON Template</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800 overflow-x-auto">
                    Cloud Provider, Category, Difficulty, Subcategory, Question Title, Short Answer (Public Teaser), Detailed Interview Answer
                  </p>
                </div>

                {/* FILE UPLOAD DROPZONE OPTION */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FolderPlus className="w-4 h-4 text-emerald-400" />
                    <span>Option 1: Upload File (.xlsx, .xls, .csv, .json, .txt)</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/60 transition-colors p-5 rounded-2xl bg-slate-950/60 text-center flex flex-col items-center justify-center gap-2 group cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.json,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-3 bg-slate-900 rounded-full border border-slate-800 group-hover:border-emerald-500/40 text-emerald-400 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-xs">Click to browse or Drag & Drop Question File</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Supports Excel (.xlsx, .xls), CSV files, JSON arrays, and plain text files</div>
                    </div>

                    {uploadedFileName && (
                      <div className="mt-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{uploadedFileName}</span>
                        {uploadedFileStats && <span className="text-slate-400">({uploadedFileStats})</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* PASTE / INSPECT RAW TEXT OPTION */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Option 2: Paste or Edit Raw Text Content</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder={`"AWS","AWS Cloud Architecture","Intermediate","Networking","What is VPC Peering?","Short summary teaser...","Detailed breakdown answer..."`}
                    value={importCsvText}
                    onChange={e => setImportCsvText(e.target.value)}
                    className="w-full font-mono text-[11px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Process File & Bulk Import</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

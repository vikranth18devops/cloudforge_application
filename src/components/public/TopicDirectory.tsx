import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CloudProvider, Question } from '../../types';
import { 
  Cloud, 
  Boxes, 
  Code2, 
  Server, 
  Globe, 
  ShieldCheck, 
  DollarSign, 
  Eye, 
  Bookmark, 
  ChevronRight,
  Filter,
  Box,
  Layers,
  RefreshCw,
  Terminal,
  Activity,
  LineChart
} from 'lucide-react';

export const TopicDirectory: React.FC<{ onSelectQuestion: (q: Question) => void }> = ({ onSelectQuestion }) => {
  const { questions, categories, selectedCloud, setSelectedCloud, searchQuery, userMode, userProfile } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // Determine allowed cloud tabs based on user profile or active selection
  const userTargetCloud = userProfile.targetCloud || 'AWS';

  const getCloudQuestionCount = (cloudName: string): number => {
    return questions.filter(q => {
      if (cloudName === 'All') return true;
      if (q.cloud === cloudName || q.cloud.toLowerCase() === cloudName.toLowerCase()) return true;
      if (cloudName === 'AWS' && ((q.cloud as string) === 'Amazon Web Services' || q.category.toLowerCase().includes('aws') || q.category.toLowerCase().includes('amazon'))) return true;
      if (cloudName === 'Amazon Web Services' && (q.cloud === 'AWS' || q.category.toLowerCase().includes('aws'))) return true;
      return false;
    }).length;
  };

  const getCategoryLiveCount = (catName: string): number => {
    const catLower = catName.toLowerCase();
    
    // Top-level umbrella cloud categories
    if (catLower === 'amazon web services' || catLower === 'aws') {
      return questions.filter(q => 
        q.cloud === 'AWS' || 
        (q.cloud as string) === 'Amazon Web Services' || 
        q.category.toLowerCase().includes('aws') ||
        q.category.toLowerCase().includes('amazon')
      ).length;
    }
    
    if (catLower === 'kubernetes & containers' || catLower === 'kubernetes') {
      return questions.filter(q => q.cloud === 'Kubernetes' || q.category.toLowerCase().includes('kubernetes')).length;
    }
    
    if (catLower === 'terraform & iac' || catLower === 'terraform') {
      return questions.filter(q => q.cloud === 'Terraform' || q.category.toLowerCase().includes('terraform')).length;
    }

    if (catLower === 'microsoft azure' || catLower === 'azure') {
      return questions.filter(q => q.cloud === 'Azure' || q.category.toLowerCase().includes('azure')).length;
    }

    if (catLower === 'google cloud platform' || catLower === 'gcp') {
      return questions.filter(q => q.cloud === 'GCP' || q.category.toLowerCase().includes('gcp')).length;
    }

    if (catLower === 'docker & containerization' || catLower === 'docker') {
      return questions.filter(q => q.cloud === 'Docker' || q.category.toLowerCase().includes('docker')).length;
    }

    // Specific domain category (Compute, Security, Networking, Storage, Containers, Database, etc.)
    return questions.filter(q => {
      const qCat = (q.category || '').toLowerCase();
      const qSub = (q.subcategory || '').toLowerCase();
      if (qCat === catLower) return true;
      if (qSub === catLower) return true;
      if (qCat.length > 2 && catLower.includes(qCat)) return true;
      if (catLower.length > 2 && qCat.includes(catLower)) return true;
      return false;
    }).length;
  };

  const getAllowedCloudTabs = (): string[] => {
    if (userMode !== 'student') {
      return ['All', 'AWS', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'Azure', 'GCP', 'DevOps', 'DevSecOps', 'FinOps'];
    }
    switch (userTargetCloud) {
      case 'AWS':
        return ['AWS', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'DevOps', 'DevSecOps', 'FinOps'];
      case 'Azure':
        return ['Azure', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'DevOps', 'DevSecOps', 'FinOps'];
      case 'GCP':
        return ['GCP', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'DevOps', 'DevSecOps', 'FinOps'];
      case 'Kubernetes':
        return ['Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'SRE', 'Observability', 'DevOps', 'DevSecOps'];
      case 'Terraform':
        return ['Terraform', 'Docker', 'Jenkins', 'SRE', 'Observability', 'DevOps'];
      default:
        return ['All', 'AWS', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'Azure', 'GCP', 'DevOps', 'DevSecOps', 'FinOps'];
    }
  };

  const allowedTabs = getAllowedCloudTabs();

  // Filter out questions belonging to excluded cloud platforms (e.g. hide Azure & GCP when studying AWS)
  const filteredQuestions = questions.filter(q => {
    // In student mode, hide opposing cloud vendors
    if (userMode === 'student' && userTargetCloud !== 'Multi-cloud') {
      if (userTargetCloud === 'AWS' && (q.cloud === 'Azure' || q.cloud === 'GCP')) return false;
      if (userTargetCloud === 'Azure' && (q.cloud === 'AWS' || q.cloud === 'GCP')) return false;
      if (userTargetCloud === 'GCP' && (q.cloud === 'AWS' || q.cloud === 'Azure')) return false;
      if (userTargetCloud === 'Kubernetes' && (q.cloud === 'AWS' || q.cloud === 'Azure' || q.cloud === 'GCP')) return false;
    }

    const matchesCloud = selectedCloud === 'All' || 
      q.cloud === selectedCloud ||
      q.cloud.toLowerCase() === selectedCloud.toLowerCase() ||
      (selectedCloud === 'AWS' && ((q.cloud as string) === 'Amazon Web Services' || q.category.toLowerCase().includes('aws') || q.category.toLowerCase().includes('amazon'))) ||
      ((selectedCloud as string) === 'Amazon Web Services' && (q.cloud === 'AWS' || q.category.toLowerCase().includes('aws')));

    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesCat = !activeCategory || q.category.toLowerCase() === activeCategory.toLowerCase() || (activeCategory.toLowerCase() === 'amazon web services' && (q.cloud === 'AWS' || (q.cloud as string) === 'Amazon Web Services'));
    const matchesSubcat = !activeSubcategory || q.subcategory?.toLowerCase() === activeSubcategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCloud && matchesDiff && matchesCat && matchesSubcat && matchesSearch;
  });

  // Returns cloud provider icon component
  const getCloudIcon = (cloud: CloudProvider) => {
    switch (cloud) {
      case 'AWS': return <Cloud className="w-5 h-5 text-amber-400" />;
      case 'Kubernetes': return <Boxes className="w-5 h-5 text-indigo-400" />;
      case 'Docker': return <Box className="w-5 h-5 text-cyan-400" />;
      case 'Helm': return <Layers className="w-5 h-5 text-blue-400" />;
      case 'ArgoCD': return <RefreshCw className="w-5 h-5 text-orange-400" />;
      case 'Jenkins': return <Terminal className="w-5 h-5 text-rose-400" />;
      case 'SRE': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Observability': return <LineChart className="w-5 h-5 text-teal-400" />;
      case 'Terraform': return <Code2 className="w-5 h-5 text-purple-400" />;
      case 'Azure': return <Server className="w-5 h-5 text-sky-400" />;
      case 'GCP': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'DevSecOps': return <ShieldCheck className="w-5 h-5 text-pink-400" />;
      case 'FinOps': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      default: return <Cloud className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="topics-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore {userMode === 'student' ? `${userTargetCloud} Candidate` : 'Cloud & DevOps'} Topics
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {userMode === 'student' 
              ? `Tailored question repository filtered exclusively for your target ecosystem: ${userTargetCloud}.`
              : 'Browse high-frequency interview questions across production cloud platforms.'}
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedDifficulty === diff 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Active Selected Cloud Banner (if specific cloud selected) */}
      {(selectedCloud !== 'All' || activeCategory) && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40">
              {getCloudIcon((selectedCloud === 'All' ? 'AWS' : selectedCloud) as CloudProvider)}
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Tailored Preparation Syllabus</div>
              <h3 className="text-base font-extrabold text-white">
                Showing {selectedCloud !== 'All' ? `${selectedCloud} ` : ''}{activeCategory ? `• Category: ${activeCategory}` : 'Questions & Scenarios'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCloud('All');
              setActiveCategory(null);
              setActiveSubcategory(null);
            }}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Cloud Provider Tabs with Live Question Count Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {allowedTabs.map(cloud => {
          const tabCount = getCloudQuestionCount(cloud);

          return (
            <button
              key={cloud}
              onClick={() => {
                setSelectedCloud(cloud as CloudProvider | 'All');
                setActiveCategory(null);
                setActiveSubcategory(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedCloud === cloud
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cloud !== 'All' && getCloudIcon(cloud as CloudProvider)}
              <span>{cloud}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedCloud === cloud ? 'bg-indigo-500/40 text-white' : 'bg-slate-800 text-indigo-300 border border-indigo-500/20'
              }`}>
                {tabCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Top Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10">
        {(() => {
          // Merge static categories with any custom categories present in questions
          const allCatList = [...categories];
          const existingNames = new Set(categories.map(c => c.name.toLowerCase()));
          
          questions.forEach(q => {
            if (q.category && !existingNames.has(q.category.toLowerCase())) {
              existingNames.add(q.category.toLowerCase());
              allCatList.push({
                id: `dynamic-cat-${q.category.toLowerCase()}`,
                name: q.category,
                cloud: q.cloud,
                description: `Production interview topics and troubleshooting questions for ${q.category}.`,
                questionCount: questions.filter(item => item.category.toLowerCase() === q.category.toLowerCase()).length,
                subcategories: [q.subcategory || 'General'],
                iconName: 'Cloud'
              });
            }
          });

          const displayCats = selectedCloud === 'All'
            ? allCatList.slice(0, 10)
            : allCatList.filter(c => c.cloud === selectedCloud || (selectedCloud === 'AWS' && (c.cloud === 'AWS' || c.name.toLowerCase().includes('aws'))));

          return displayCats.map(cat => {
            const liveQCount = getCategoryLiveCount(cat.name);
            const isSelected = activeCategory?.toLowerCase() === cat.name.toLowerCase();
            
            return (
              <div 
                key={cat.id || cat.name} 
                onClick={() => {
                  if (isSelected) {
                    setActiveCategory(null);
                  } else {
                    setActiveCategory(cat.name);
                  }
                  setActiveSubcategory(null);
                }}
                className={`glass-card p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50' 
                    : 'border-slate-800/80 hover:border-indigo-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                      {getCloudIcon(cat.cloud)}
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {liveQCount} {liveQCount === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Question List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
          <span>Showing {filteredQuestions.length} Questions</span>
          <span>Click to view preview & answer</span>
        </div>

        {filteredQuestions.map(q => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q)}
            className="glass-card p-5 rounded-xl border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
                    {getCloudIcon(q.cloud)}
                    {q.cloud}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {q.category} • {q.subcategory}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    q.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/10' :
                    q.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-500/10' :
                    'text-rose-400 bg-rose-500/10'
                  }`}>
                    ⭐ {q.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-indigo-300 transition-colors">
                  {q.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {q.previewAnswer}
                </p>
              </div>

              {/* Action side */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {(q.viewsCount / 1000).toFixed(1)}k</span>
                  <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-indigo-400" /> {q.bookmarksCount}</span>
                </div>

                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold rounded-lg border border-indigo-500/30 transition-all">
                  <span>View Answer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

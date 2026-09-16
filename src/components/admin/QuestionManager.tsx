import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Question, CloudProvider, DifficultyLevel } from '../../types';
import { 
  Plus, 
  Edit3, 
  X, 
  FolderTree, 
  Filter, 
  Layers, 
  List, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

export const QuestionManager: React.FC = () => {
  const { questions, setQuestions, categories } = useApp();
  const [filterCloud, setFilterCloud] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');
  
  // Selection State for Bulk Delete
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  // Deletion Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    targetIds: string[];
    targetTitle?: string;
  }>({ isOpen: false, targetIds: [] });

  // Notification Toast State
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Question Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({
    cloud: 'AWS',
    category: 'Compute',
    subcategory: 'EC2',
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    status: 'Published',
    title: '',
    previewAnswer: '',
    fullAnswer: '',
    realWorldExample: ''
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Extract unique category names
  const availableCategories = ['All', ...Array.from(new Set(questions.map(q => q.category)))];

  const filtered = questions.filter(q => {
    const matchesCloud = filterCloud === 'All' || q.cloud === filterCloud;
    const matchesCat = filterCategory === 'All' || q.category === filterCategory;
    return matchesCloud && matchesCat;
  });

  // Group filtered questions by category
  const groupedQuestions = filtered.reduce((acc, q) => {
    const key = q.category || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Checkbox Selection Handlers
  const handleToggleSelectQuestion = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (questionsList: Question[]) => {
    const ids = questionsList.map(q => q.id);
    const allSelected = ids.every(id => selectedQuestionIds.includes(id));

    if (allSelected) {
      setSelectedQuestionIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedQuestionIds(prev => Array.from(new Set([...prev, ...ids])));
    }
  };

  // Execute Question Deletion
  const handleConfirmDelete = () => {
    if (deleteModal.targetIds.length === 0) return;
    const deletedCount = deleteModal.targetIds.length;
    
    setQuestions(prev => prev.filter(q => !deleteModal.targetIds.includes(q.id)));
    setSelectedQuestionIds(prev => prev.filter(id => !deleteModal.targetIds.includes(id)));
    setDeleteModal({ isOpen: false, targetIds: [] });
    
    showNotification(
      deletedCount === 1 
        ? 'Question deleted successfully.' 
        : `Successfully deleted ${deletedCount} questions.`
    );
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion.title) return;

    if (editingQuestion.id) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, ...editingQuestion } as Question : q));
      showNotification('Question updated successfully.');
    } else {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        cloud: (editingQuestion.cloud as CloudProvider) || 'AWS',
        category: editingQuestion.category || 'Compute',
        subcategory: editingQuestion.subcategory || 'General',
        title: editingQuestion.title || 'New Question',
        previewAnswer: editingQuestion.previewAnswer || '',
        fullAnswer: editingQuestion.fullAnswer || '',
        realWorldExample: editingQuestion.realWorldExample || '',
        commonMistakes: [],
        followUpQuestions: [],
        difficulty: (editingQuestion.difficulty as DifficultyLevel) || 'Intermediate',
        targetExperience: '1-2 Years',
        isLocked: true,
        viewsCount: 120,
        bookmarksCount: 15,
        sharesCount: 8,
        signupsConverted: 4,
        publishedAt: new Date().toISOString().split('T')[0],
        status: 'Published'
      };
      setQuestions(prev => [newQ, ...prev]);
      showNotification('New question published successfully.');
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-amber-400" />
            Category-Wise Question Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter, group, manage, edit, or delete interview questions.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grouped' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Category Wise</span>
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'flat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>All Questions</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingQuestion({
                cloud: 'AWS',
                category: 'Compute',
                subcategory: 'EC2',
                difficulty: 'Intermediate',
                targetExperience: '1-2 Years',
                status: 'Published',
                title: '',
                previewAnswer: '',
                fullAnswer: '',
                realWorldExample: ''
              });
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-glow-aws transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Question</span>
          </button>
        </div>
      </div>

      {/* Bulk Delete Active Selection Bar */}
      {selectedQuestionIds.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">Bulk Question Management</div>
              <div className="text-sm font-extrabold text-white">
                {selectedQuestionIds.length} {selectedQuestionIds.length === 1 ? 'Question' : 'Questions'} Selected
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedQuestionIds([])}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Deselect All
            </button>
            <button
              onClick={() => setDeleteModal({
                isOpen: true,
                targetIds: selectedQuestionIds,
                targetTitle: `${selectedQuestionIds.length} selected questions`
              })}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedQuestionIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Cloud & Category Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Cloud Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">Cloud:</span>
          {['All', 'AWS', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Jenkins', 'SRE', 'Observability', 'Terraform', 'Azure', 'GCP', 'DevOps', 'DevSecOps', 'FinOps'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCloud(c)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterCloud === c 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Category Dropdown Selector */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-300 whitespace-nowrap">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* CATEGORY WISE GROUPED VIEW MODE */}
      {viewMode === 'grouped' ? (
        <div className="space-y-6">
          {Object.keys(groupedQuestions).length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              No questions found matching selected Cloud & Category filters.
            </div>
          ) : (
            Object.entries(groupedQuestions).map(([catName, catQuestions]) => {
              const allInGroupSelected = catQuestions.length > 0 && catQuestions.every(q => selectedQuestionIds.includes(q.id));
              
              return (
                <div key={catName} className="glass-panel bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  
                  {/* Category Group Banner */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={allInGroupSelected}
                        onChange={() => handleToggleSelectAll(catQuestions)}
                        title="Select/Deselect all in this category"
                        className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950 cursor-pointer"
                      />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <h3 className="text-base font-extrabold text-white">📁 {catName}</h3>
                      <span className="text-xs text-slate-400 font-medium">({catQuestions.length} Questions)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {catQuestions.some(q => selectedQuestionIds.includes(q.id)) && (
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            targetIds: catQuestions.filter(q => selectedQuestionIds.includes(q.id)).map(q => q.id),
                            targetTitle: `Selected questions in ${catName}`
                          })}
                          className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs rounded-lg border border-rose-500/30 transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Group Selection</span>
                        </button>
                      )}
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs">
                        Category Group
                      </span>
                    </div>
                  </div>

                  {/* Category Questions List Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={allInGroupSelected}
                              onChange={() => handleToggleSelectAll(catQuestions)}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                            />
                          </th>
                          <th className="p-3">Cloud / Subcategory</th>
                          <th className="p-3">Question Title</th>
                          <th className="p-3">Difficulty</th>
                          <th className="p-3">Views / Shares</th>
                          <th className="p-3">Signups</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {catQuestions.map(q => {
                          const isSelected = selectedQuestionIds.includes(q.id);

                          return (
                            <tr 
                              key={q.id} 
                              className={`transition-colors ${isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-800/40'}`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectQuestion(q.id)}
                                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-white">☁ {q.cloud}</div>
                                <div className="text-[11px] text-slate-400">{q.subcategory}</div>
                              </td>
                              <td className="p-3 font-semibold text-white max-w-xs truncate">
                                {q.title}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  ⭐ {q.difficulty}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold">{q.viewsCount.toLocaleString()} views</div>
                                <div className="text-[11px] text-slate-400">{q.sharesCount} shares</div>
                              </td>
                              <td className="p-3 font-bold text-emerald-400">
                                +{q.signupsConverted}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingQuestion(q);
                                      setIsEditorOpen(true);
                                    }}
                                    title="Edit Question"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteModal({
                                      isOpen: true,
                                      targetIds: [q.id],
                                      targetTitle: q.title
                                    })}
                                    title="Delete Question"
                                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-400 hover:text-rose-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* FLAT TABLE VIEW MODE */
        <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every(q => selectedQuestionIds.includes(q.id))}
                      onChange={() => handleToggleSelectAll(filtered)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Cloud / Category</th>
                  <th className="p-4">Question Title</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Views / Shares</th>
                  <th className="p-4">Signups</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map(q => {
                  const isSelected = selectedQuestionIds.includes(q.id);

                  return (
                    <tr 
                      key={q.id} 
                      className={`transition-colors ${isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-800/40'}`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectQuestion(q.id)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{q.cloud}</div>
                        <div className="text-[11px] text-amber-400 font-semibold">{q.category} • {q.subcategory}</div>
                      </td>
                      <td className="p-4 font-semibold text-white max-w-xs truncate">
                        {q.title}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          ⭐ {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{q.viewsCount.toLocaleString()} views</div>
                        <div className="text-[11px] text-slate-400">{q.sharesCount} shares</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        +{q.signupsConverted}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingQuestion(q);
                              setIsEditorOpen(true);
                            }}
                            title="Edit Question"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({
                              isOpen: true,
                              targetIds: [q.id],
                              targetTitle: q.title
                            })}
                            title="Delete Question"
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-400 hover:text-rose-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Question Deletion</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {deleteModal.targetIds.length === 1 ? (
                <p>Are you sure you want to permanently delete the question: <strong className="text-white">"{deleteModal.targetTitle}"</strong>?</p>
              ) : (
                <p>Are you sure you want to permanently delete <strong className="text-rose-400">{deleteModal.targetIds.length} selected questions</strong>?</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, targetIds: [] })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRD Section 21 Question Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-panel bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingQuestion.id ? 'Edit Question' : 'Create Question'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cloud Provider</label>
                <select
                  value={editingQuestion.cloud}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev, cloud: e.target.value as CloudProvider }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="Kubernetes">Kubernetes</option>
                  <option value="Docker">Docker</option>
                  <option value="Helm">Helm</option>
                  <option value="ArgoCD">ArgoCD</option>
                  <option value="Jenkins">Jenkins</option>
                  <option value="SRE">SRE</option>
                  <option value="Observability">Observability</option>
                  <option value="Terraform">Terraform</option>
                  <option value="DevOps">DevOps</option>
                  <option value="DevSecOps">DevSecOps</option>
                  <option value="FinOps">FinOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editingQuestion.category}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Compute">Compute</option>
                  <option value="Security">Security</option>
                  <option value="Networking">Networking</option>
                  <option value="Infrastructure as Code">Infrastructure as Code</option>
                  <option value="Cost Optimization">Cost Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                <select
                  value={editingQuestion.difficulty}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev, difficulty: e.target.value as DifficultyLevel }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategory</label>
              {(() => {
                const currentCat = categories.find(c => c.name.toLowerCase() === editingQuestion.category?.toLowerCase() || c.cloud === editingQuestion.cloud);
                const subcats = currentCat && currentCat.subcategories.length > 0
                  ? currentCat.subcategories
                  : Array.from(new Set(categories.flatMap(c => c.subcategories)));

                return (
                  <select
                    value={editingQuestion.subcategory || subcats[0] || 'General'}
                    onChange={(e) => setEditingQuestion(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-bold"
                  >
                    {subcats.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {!subcats.includes('General') && <option value="General">General</option>}
                  </select>
                );
              })()}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Question Title</label>
              <input
                type="text"
                value={editingQuestion.title || ''}
                onChange={(e) => setEditingQuestion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. What is the difference between Security Groups and NACLs in AWS?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Answer (Public Teaser)</label>
              <textarea
                rows={2}
                value={editingQuestion.previewAnswer || ''}
                onChange={(e) => setEditingQuestion(prev => ({ ...prev, previewAnswer: e.target.value }))}
                placeholder="Short concept explanation shown before locking full answer..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Interview Answer</label>
              <textarea
                rows={4}
                value={editingQuestion.fullAnswer || ''}
                onChange={(e) => setEditingQuestion(prev => ({ ...prev, fullAnswer: e.target.value }))}
                placeholder="Comprehensive expected interviewer answer..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <button
              onClick={handleSaveQuestion}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-glow-aws transition-all"
            >
              Publish Question
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

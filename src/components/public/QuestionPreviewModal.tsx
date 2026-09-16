import React from 'react';
import type { Question } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, CheckCircle2, Lock, ArrowRight, Share2 } from 'lucide-react';

export const QuestionPreviewModal: React.FC<{ question: Question | null; onClose: () => void }> = ({ question, onClose }) => {
  const { setIsSignUpModalOpen, setActiveShareModalQuestion } = useApp();

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Question Header Metadata */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs rounded-md">
            {question.cloud}
          </span>
          <span className="text-xs text-slate-400">
            {question.category} • {question.subcategory}
          </span>
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            ⭐ {question.difficulty}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 leading-snug">
          {question.title}
        </h2>

        {/* Public Concept Preview */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
            [ Concept Preview ]
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {question.previewAnswer}
          </p>
        </div>

        {/* Locked Content Card (PRD Section 6) */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border-2 border-indigo-500/40 shadow-glow-indigo text-center">
          
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Want the complete interview answer?
          </h3>
          <p className="text-xs text-slate-300 mb-6">
            Sign up free to unlock production diagrams, scenario diagnostics, and follow-ups.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-md mx-auto mb-6 text-xs text-slate-200 font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real-world production example</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Architecture diagram</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Production incident scenario</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Expected interviewer follow-up answers</div>
          </div>

          <button
            onClick={() => {
              onClose();
              setIsSignUpModalOpen(true);
            }}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-glow-indigo transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Unlock Full Answer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6 text-xs text-slate-400">
          <span>{question.viewsCount.toLocaleString()} engineers viewed</span>
          <button
            onClick={() => setActiveShareModalQuestion(question)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Question</span>
          </button>
        </div>

      </div>
    </div>
  );
};

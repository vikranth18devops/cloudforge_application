import React, { useState } from 'react';
import type { Question } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Share2, 
  Sparkles, 
  Lightbulb, 
  Search, 
  Layers, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  Brain
} from 'lucide-react';

export const QuestionDetailView: React.FC<{ question: Question; onBack: () => void }> = ({ question, onBack }) => {
  const { userProfile, toggleBookmark, markQuestionCompleted, setActiveShareModalQuestion } = useApp();
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userDraftAnswer, setUserDraftAnswer] = useState<string>('');

  const isBookmarked = userProfile.bookmarkedQuestionIds.includes(question.id);
  const isCompleted = userProfile.completedQuestionIds.includes(question.id);

  const handleReveal = () => {
    setIsAnswerRevealed(true);
    markQuestionCompleted(question.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Questions</span>
        </button>

        <div className="text-xs text-slate-400 font-medium">
          {question.cloud} &gt; {question.category} &gt; <span className="text-indigo-400">{question.subcategory}</span>
        </div>
      </div>

      {/* Question Card Container (PRD Section 11 Wireframe) */}
      <div className="glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs rounded-md">
              ☁ {question.cloud}
            </span>
            <span className="text-xs text-slate-400">
              {question.category} • {question.subcategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              question.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/10' :
              question.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-500/10' :
              'text-rose-400 bg-rose-500/10'
            }`}>
              ⭐ {question.difficulty}
            </span>

            {isCompleted && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>
        </div>

        {/* Question Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
          {question.title}
        </h1>

        {/* Think & Answer Interactive Mode */}
        {!isAnswerRevealed ? (
          <div className="bg-slate-950 rounded-xl p-5 border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>Think & Formulate Your Answer First</span>
            </div>
            
            <p className="text-xs text-slate-300">
              Type your key response points below before checking the interviewer's expected architecture answer.
            </p>

            <textarea
              rows={3}
              placeholder="e.g., AMI is a stateless OS image blueprint, whereas EC2 is the live running server..."
              value={userDraftAnswer}
              onChange={(e) => setUserDraftAnswer(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleReveal}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Reveal Full Interview Answer & Architecture</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 💡 Interviewer Expected Answer */}
            <div className="bg-slate-950/90 rounded-xl p-5 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 Expected Interviewer Answer</span>
              </div>
              
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {question.fullAnswer}
              </div>
            </div>

            {/* 🔍 Real-world Example */}
            <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>🔍 Production Real-world Example</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {question.realWorldExample}
              </p>
            </div>

            {/* 🏗 Architecture Diagram Visualizer */}
            {question.architectureDiagram && (
              <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>🏗 Architecture Topology</span>
                </div>
                <div className="terminal-window p-4 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre leading-snug">
                  {question.architectureDiagram}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {question.commonMistakes && question.commonMistakes.length > 0 && (
              <div className="bg-rose-950/20 rounded-xl p-5 border border-rose-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Common Candidate Pitfalls</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  {question.commonMistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Questions */}
            {question.followUpQuestions && question.followUpQuestions.length > 0 && (
              <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>🔥 Expected Follow-Up Questions</span>
                </div>
                <div className="space-y-3">
                  {question.followUpQuestions.map(fu => (
                    <div key={fu.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <p className="text-xs font-bold text-white mb-1">Q: {fu.question}</p>
                      <p className="text-xs text-slate-400"><strong>Answer Hint:</strong> {fu.expectedAnswerHint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-800 pt-4 gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleBookmark(question.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border transition-all ${
                isBookmarked 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={() => setActiveShareModalQuestion(question)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Social Card</span>
            </button>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-glow-indigo"
          >
            <span>Practice Similar Questions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

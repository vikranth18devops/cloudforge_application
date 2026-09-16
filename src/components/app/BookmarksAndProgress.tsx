import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Question } from '../../types';
import { Bookmark, Flame, ChevronRight } from 'lucide-react';

export const BookmarksAndProgress: React.FC<{ onSelectQuestion: (q: Question) => void }> = ({ onSelectQuestion }) => {
  const { userProfile, questions } = useApp();

  const bookmarkedQuestions = questions.filter(q => userProfile.bookmarkedQuestionIds.includes(q.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-400" />
          Bookmarks & Learning Progress
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review saved interview questions, completed topics, and badge accomplishments.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {userProfile.badges.map(b => (
          <div key={b.id} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{b.title}</div>
              <div className="text-[11px] text-slate-400">Unlocked {b.unlockedAt}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookmarks Section */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Saved Bookmarks ({bookmarkedQuestions.length})</h2>
        {bookmarkedQuestions.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center text-slate-400 text-xs">
            No bookmarked questions yet. Click the bookmark icon on any question to save it for quick review!
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarkedQuestions.map(q => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q)}
                className="glass-card p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      ☁ {q.cloud}
                    </span>
                    <span className="text-xs text-slate-400">{q.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white hover:text-indigo-300">{q.title}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

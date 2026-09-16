import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, TrendingUp, AlertTriangle } from 'lucide-react';

export const ContentAndSearchAnalytics: React.FC = () => {
  const { questions, searchLogs } = useApp();

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-xl font-extrabold text-white">Content & Search Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Analyze question signup conversion drivers and identify missing content demand.</p>
      </div>

      {/* Top Question Performance Table (PRD Section 27 & 28) */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Highest Signup-Converting Content
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Question Title</th>
                <th className="p-3">Cloud</th>
                <th className="p-3">Views</th>
                <th className="p-3">Bookmarks</th>
                <th className="p-3">Shares</th>
                <th className="p-3">Signups Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {questions.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white max-w-sm truncate">{q.title}</td>
                  <td className="p-3 font-bold text-indigo-400">{q.cloud}</td>
                  <td className="p-3">{q.viewsCount.toLocaleString()}</td>
                  <td className="p-3">{q.bookmarksCount}</td>
                  <td className="p-3">{q.sharesCount}</td>
                  <td className="p-3 font-extrabold text-emerald-400">+{q.signupsConverted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Opportunities (PRD Section 29) */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            Top User Search Queries & Content Opportunities
          </h3>
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded">
            Live Search Logs
          </span>
        </div>

        <div className="space-y-3">
          {searchLogs.map(log => (
            <div key={log.query} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white font-mono">"{log.query}"</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{log.count.toLocaleString()} searches this month</div>
              </div>

              {!log.hasResult ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High Demand • Content Opportunity</span>
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  {log.conversionRate}% Conversion
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

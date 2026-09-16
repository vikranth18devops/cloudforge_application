import React from 'react';
import { Users, Eye, MousePointerClick, UserCheck, Play, Mic } from 'lucide-react';

export const FunnelAnalytics: React.FC = () => {
  const funnelStages = [
    { stage: '1. Visitors', count: 100000, pct: 100, dropoff: '38.0% dropoff', icon: Users, color: 'bg-indigo-600' },
    { stage: '2. Content Views', count: 62000, pct: 62, dropoff: '66.1% dropoff', icon: Eye, color: 'bg-cyan-600' },
    { stage: '3. Signup CTA Clicks', count: 21000, pct: 21, dropoff: '40.9% dropoff', icon: MousePointerClick, color: 'bg-blue-600' },
    { stage: '4. Signups Completed', count: 12400, pct: 12.4, dropoff: '28.2% dropoff', icon: UserCheck, color: 'bg-emerald-600' },
    { stage: '5. Activated Users', count: 8900, pct: 8.9, dropoff: '49.4% dropoff', icon: UserCheck, color: 'bg-teal-600' },
    { stage: '6. Active Practice Users', count: 4500, pct: 4.5, dropoff: '60.0% dropoff', icon: Play, color: 'bg-amber-600' },
    { stage: '7. AI Mock Interviews', count: 1800, pct: 1.8, dropoff: 'Final Conversion', icon: Mic, color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-white">Visitor Conversion Funnel</h2>
        <p className="text-xs text-slate-400 mt-0.5">Track end-to-end user acquisition from organic search to paid mock interviews.</p>
      </div>

      {/* Funnel Diagram Box (PRD Section 26 Wireframe) */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4">
        {funnelStages.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={item.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-indigo-400" />
                  {item.stage}
                </span>
                <span className="text-slate-300 font-mono">{item.count.toLocaleString()} ({item.pct}%)</span>
              </div>

              <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden p-1 border border-slate-800 relative">
                <div 
                  className={`h-full ${item.color} rounded-lg transition-all duration-1000 flex items-center justify-end pr-3 text-[10px] font-bold text-white shadow-sm`}
                  style={{ width: `${Math.max(5, item.pct)}%` }}
                >
                  {item.pct}%
                </div>
              </div>

              {idx < funnelStages.length - 1 && (
                <div className="text-[10px] text-rose-400 font-semibold text-center py-0.5">
                  ↓ {item.dropoff}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

import React from 'react';
import { Share2, MessageSquare, Send, Globe } from 'lucide-react';

export const SocialAnalyticsDashboard: React.FC = () => {
  const socialPlatforms = [
    { name: 'LinkedIn', pct: 48, shares: 5960, signups: 599, icon: Globe, color: 'bg-blue-600' },
    { name: 'WhatsApp', pct: 22, shares: 2732, signups: 274, icon: MessageSquare, color: 'bg-emerald-600' },
    { name: 'X (Twitter)', pct: 15, shares: 1863, signups: 187, icon: Share2, color: 'bg-slate-700' },
    { name: 'Telegram', pct: 9, shares: 1117, signups: 112, icon: Send, color: 'bg-sky-600' },
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-xl font-extrabold text-white">Social Sharing & Growth Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Track viral share card engagement, referral traffic, and social signups.</p>
      </div>

      {/* Social KPI Cards (PRD Section 30 Wireframe) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Social Shares</div>
          <div className="text-3xl font-extrabold text-white mt-1">12,421</div>
          <div className="text-xs text-indigo-400 font-medium mt-1">Across 4 Social Networks</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase">Social Referral Visits</div>
          <div className="text-3xl font-extrabold text-white mt-1">8,932</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">71.9% CTR from shared cards</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase">Signups From Shares</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">1,248</div>
          <div className="text-xs text-slate-400 font-medium mt-1">13.9% Viral Conversion Rate</div>
        </div>

      </div>

      {/* Platform Performance (PRD Section 30 Wireframe) */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          Share Volume & Conversion by Platform
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map(p => {
            const IconComp = p.icon;
            return (
              <div key={p.name} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-indigo-400" />
                    {p.name}
                  </span>
                  <span className="text-xs font-bold text-indigo-400">{p.pct}% Share Share</span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>{p.shares.toLocaleString()} Shares</span>
                  <span className="text-emerald-400 font-semibold">+{p.signups} Signups</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { Users, Eye, HelpCircle, UserPlus, TrendingUp, Globe, BarChart3, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const trendData = [
    { day: 'Mon', visitors: 6200, signups: 420 },
    { day: 'Tue', visitors: 7800, signups: 580 },
    { day: 'Wed', visitors: 9400, signups: 710 },
    { day: 'Thu', visitors: 8900, signups: 640 },
    { day: 'Fri', visitors: 11200, signups: 890 },
    { day: 'Sat', visitors: 10500, signups: 820 },
    { day: 'Sun', visitors: 12400, signups: 980 },
  ];

  const trafficSources = [
    { name: 'Google SEO', value: 52, color: '#4285f4' },
    { name: 'LinkedIn', value: 21, color: '#0a66c2' },
    { name: 'Direct', value: 13, color: '#6366f1' },
    { name: 'WhatsApp', value: 8, color: '#25d366' },
    { name: 'Other', value: 6, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Executive Metrics Row (PRD Section 19 Wireframe) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">24,821</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% this week</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">48,923</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.5% this week</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Bank</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">2,842</div>
          <div className="text-xs text-slate-400 mt-2 font-medium"> Across 8 Cloud Providers</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signups</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">4,182</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.1% conversion</span>
          </div>
        </div>

      </div>

      {/* Visitor Trends Chart */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Visitor & Signup Trends
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time daily visitor engagement spikes</p>
          </div>
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Traffic Sources & Popular Topics (PRD Section 19 Wireframe) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Sources */}
        <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Traffic Acquisition Sources
          </h3>

          <div className="space-y-3">
            {trafficSources.map(source => (
              <div key={source.name} className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  {source.name}
                </span>
                <span className="text-white">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Popular Topics Distribution
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { topic: 'Kubernetes', pct: 28, color: 'bg-indigo-500' },
              { topic: 'AWS EC2 & IAM', pct: 24, color: 'bg-amber-500' },
              { topic: 'Terraform State', pct: 18, color: 'bg-purple-500' },
              { topic: 'Azure AKS', pct: 14, color: 'bg-sky-500' },
              { topic: 'DevSecOps', pct: 10, color: 'bg-pink-500' },
            ].map(item => (
              <div key={item.topic} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-200">{item.topic}</span>
                  <span className="text-indigo-400">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

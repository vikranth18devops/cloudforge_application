import React, { useState } from 'react';
import { Shield, Users, Sliders, Plus } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState({
    aiMockInterviewer: true,
    jdAnalyzer: true,
    socialShareGenerator: true,
    autoContentLock: true
  });

  const adminTeam = [
    { name: 'Alex Mercer (You)', email: 'admin@cloudinterviewlab.com', role: 'Super Admin', status: 'Active' },
    { name: 'Sarah Chen', email: 'sarah.c@cloudinterviewlab.com', role: 'Content Admin', status: 'Active' },
    { name: 'David Miller', email: 'david.m@cloudinterviewlab.com', role: 'Analyst', status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          Admin Platform Settings & RBAC Control
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage administrator roles, system feature flags, and API configurations.</p>
      </div>

      {/* RBAC Team Roles Table (PRD Section 33) */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Admin RBAC Team Members
          </h3>

          <button className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all">
            <Plus className="w-4 h-4" />
            <span>Invite Admin</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Admin User</th>
                <th className="p-3">RBAC Role</th>
                <th className="p-3">Permissions Scope</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {adminTeam.map(member => (
                <tr key={member.email} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-white">{member.name}</div>
                    <div className="text-[11px] text-slate-400">{member.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[11px]">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400">
                    {member.role === 'Super Admin' ? 'Full System & Security' : member.role === 'Content Admin' ? 'Questions, Scenarios, Categories' : 'Analytics & Read-Only'}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {member.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Flag Controls */}
      <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          Feature Flags & Experiment Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'aiMockInterviewer', title: 'AI Mock Interview Simulator', desc: 'Enable real-time voice & text interview evaluation' },
            { key: 'jdAnalyzer', title: 'Job Description (JD) Analyzer', desc: 'Enable tech-stack requirement matching' },
            { key: 'socialShareGenerator', title: 'Dynamic Social Share Generator', desc: 'Enable automated LinkedIn/X share cards' },
            { key: 'autoContentLock', title: 'Content Locking UX Teaser', desc: 'Require signup for full interview solutions' }
          ].map(flag => (
            <div key={flag.key} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white">{flag.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{flag.desc}</div>
              </div>

              <input
                type="checkbox"
                checked={(featureFlags as any)[flag.key]}
                onChange={() => setFeatureFlags(prev => ({ ...prev, [flag.key]: !(prev as any)[flag.key] }))}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-800"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

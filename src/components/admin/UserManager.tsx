import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { MOCK_ALL_USERS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Filter, 
  Flame, 
  Briefcase, 
  Mail, 
  UserCheck, 
  Download, 
  X,
  Sparkles,
  Zap,
  Trash2
} from 'lucide-react';

const STORAGE_KEY_ALL_USERS = 'cloud_interview_all_users';

const loadSavedAllUsers = (): UserProfile[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (saved) {
      const parsed: UserProfile[] = JSON.parse(saved);
      const filtered = parsed.filter(u => u.id !== 'usr-102' && u.id !== 'usr-103' && u.id !== 'usr-104' && u.id !== 'usr-105');
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(filtered));
      }
      return filtered;
    }
  } catch (e) {
    console.error('Error reading all users from localStorage:', e);
  }
  return MOCK_ALL_USERS;
};

export const UserManager: React.FC = () => {
  const [usersList, setUsersList] = useState<UserProfile[]>(loadSavedAllUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUsersList(loadSavedAllUsers());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(usersList));
    } catch (e) {
      console.error('Error saving all users to localStorage:', e);
    }
  }, [usersList]);

  const handleDeleteUser = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    if (inspectUser?.id === userId) setInspectUser(null);
  };

  const handleClearAllUsers = () => {
    setUsersList([]);
    setInspectUser(null);
  };

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || user.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpgradeAccount = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, accountType: 'Pro Member' } : u));
    if (inspectUser && inspectUser.id === userId) {
      setInspectUser(prev => prev ? { ...prev, accountType: 'Pro Member' } : null);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Role,Cloud,Readiness,AccountType,StreakDays,XP\n';
    const rows = usersList.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.role}","${u.targetCloud}",${u.readinessPercentage}%,"${u.accountType || 'Free'}",${u.streakDays},${u.xpPoints}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloud_interview_lab_candidates.csv';
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Stats Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <span>Candidate User Directory & Profile Manager</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage candidate profiles, interview readiness scores, and account tier access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {usersList.length > 0 && (
              <button
                onClick={handleClearAllUsers}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/50 transition-all"
                title="Clear all candidate accounts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Candidates</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Candidates CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Candidate Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Total Registered Candidates</div>
            <div className="text-2xl font-black text-white mt-1">{usersList.length} Users</div>
          </div>

          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Avg Readiness Score</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {Math.round(usersList.reduce((acc, u) => acc + u.readinessPercentage, 0) / usersList.length)}%
            </div>
          </div>

          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Pro & Enterprise Users</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {usersList.filter(u => u.accountType === 'Pro Member' || u.accountType === 'Enterprise').length} Candidates
            </div>
          </div>

          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Active Streaks</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {usersList.reduce((acc, u) => acc + u.streakDays, 0)} Total Days
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidate name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedRoleFilter}
            onChange={e => setSelectedRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Roles</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Cloud Architect">Cloud Architect</option>
            <option value="Platform Engineer">Platform Engineer</option>
            <option value="DevSecOps Engineer">DevSecOps Engineer</option>
            <option value="FinOps Engineer">FinOps Engineer</option>
          </select>
        </div>
      </div>

      {/* Candidate Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Target Role & Cloud</th>
                <th className="p-4">Readiness</th>
                <th className="p-4">Account Type</th>
                <th className="p-4">Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* Candidate Name & Email */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{user.name}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Target Role & Cloud */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      {user.role}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{user.targetCloud} ({user.experienceLevel})</div>
                  </td>

                  {/* Readiness Score */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-indigo-400">{user.readinessPercentage}%</span>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${user.readinessPercentage}%` }} />
                      </div>
                    </div>
                  </td>

                  {/* Account Tier Badge */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      user.accountType === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      user.accountType === 'Pro Member' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {user.accountType || 'Free Candidate'}
                    </span>
                  </td>

                  {/* Activity Stats */}
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Flame className="w-3 h-3" />
                        {user.streakDays}d streak
                      </span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Zap className="w-3 h-3" />
                        {user.xpPoints} XP
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectUser(user)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 transition-all text-xs"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-400 hover:text-rose-200 transition-colors"
                        title="Delete candidate account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Candidate Profile Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-slate-800 p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setInspectUser(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img 
                src={inspectUser.avatarUrl} 
                alt={inspectUser.name} 
                className="w-16 h-16 rounded-2xl object-cover border border-indigo-500/40"
              />
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{inspectUser.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    {inspectUser.accountType || 'Free Candidate'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{inspectUser.role} • {inspectUser.email}</p>
              </div>
            </div>

            {/* Bio & Details */}
            {inspectUser.bio && (
              <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-300">
                {inspectUser.bio}
              </div>
            )}

            {/* Career Goals */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Readiness Percentage</span>
                <span className="font-extrabold text-indigo-400 text-base">{inspectUser.readinessPercentage}%</span>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Target Compensation</span>
                <span className="font-extrabold text-emerald-400 text-base">{inspectUser.targetSalary || 'Not specified'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              {inspectUser.accountType !== 'Pro Member' && inspectUser.accountType !== 'Enterprise' ? (
                <button
                  onClick={() => handleUpgradeAccount(inspectUser.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Grant Pro Member Access</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  Pro Tier Granted
                </span>
              )}

              <button
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

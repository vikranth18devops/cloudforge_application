import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Code, MessageSquare, Shield } from 'lucide-react';
import logoImg from '../admin/logo.png';

export const Footer: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { setUserMode } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-base text-white">
              <img src={logoImg} alt="CloudForge Logo" className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30" />
              <span className="gradient-text">CLOUDFORGE</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Interactive cloud & DevOps interview preparation platform. Master AWS, Azure, GCP, Kubernetes, Terraform, DevSecOps, and FinOps with real-world scenarios & AI mock interviews.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Topics</h4>
            <ul className="space-y-2">
              <li><a href="#topics-section" className="hover:text-white transition-colors">AWS Interview Questions</a></li>
              <li><a href="#topics-section" className="hover:text-white transition-colors">Kubernetes Scenarios</a></li>
              <li><a href="#topics-section" className="hover:text-white transition-colors">Terraform State Best Practices</a></li>
              <li><a href="#topics-section" className="hover:text-white transition-colors">Azure AKS Networking</a></li>
              <li><a href="#topics-section" className="hover:text-white transition-colors">DevSecOps & FinOps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => { setUserMode('public'); onNavigateTab?.('home'); }} className="hover:text-white transition-colors">Public Website</button></li>
              <li><button onClick={() => { setUserMode('student'); onNavigateTab?.('dashboard'); }} className="hover:text-white transition-colors">Student Platform</button></li>
              <li>
                <button 
                  onClick={() => { setUserMode('admin'); onNavigateTab?.('admin-dashboard'); }} 
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex gap-3 text-slate-400">
              <Code className="w-5 h-5 hover:text-white cursor-pointer" />
              <Globe className="w-5 h-5 hover:text-cyan-400 cursor-pointer" />
              <MessageSquare className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>© 2026 CloudForge Inc. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built for Cloud Engineers & Architects worldwide
          </span>
        </div>

      </div>
    </footer>
  );
};

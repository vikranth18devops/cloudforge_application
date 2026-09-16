import React, { useState } from 'react';
import type { Question } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Share2, Copy, Check, MessageSquare, Globe, Share } from 'lucide-react';

import logoImg from '../admin/logo.png';

export const SocialShareGeneratorModal: React.FC<{ question: Question | null; onClose: () => void }> = ({ question, onClose }) => {
  const { logEvent } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'x' | 'whatsapp'>('linkedin');

  if (!question) return null;

  const shareUrl = `https://cloudinterviewlab.com/${question.cloud.toLowerCase()}/${question.id}`;

  const getCopyText = () => {
    if (selectedPlatform === 'linkedin') {
      return `☁️ ${question.cloud} Interview Question\n\nCan you answer this without checking the documentation?\n\n"${question.title}"\n\nWhat's your answer?\n\n#${question.cloud} #DevOps #CloudComputing #DevSecOps #CloudEngineer\n${shareUrl}`;
    }
    if (selectedPlatform === 'x') {
      return `🔥 ${question.cloud} Interview Challenge\n\nCan you answer this?\n\n"${question.title}"\n\nReply with your answer 👇\n\n#${question.cloud} #DevOps\n${shareUrl}`;
    }
    return `🔥 CloudForge Challenge\n\n${question.cloud} Question:\n\n${question.title}\n\nTry it here 👇\n${shareUrl}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCopyText());
    setCopied(true);
    logEvent('share_clicked', question.id, selectedPlatform);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share Question</h3>
            <p className="text-xs text-slate-400">Generate social cards & track share traffic</p>
          </div>
        </div>

        {/* Dynamic Social Card Image Preview (PRD Section 13) */}
        <div className="mb-6 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-950/80 to-slate-900 p-6 border-2 border-indigo-500/40 shadow-glow-indigo text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logoImg} alt="CloudForge Logo" className="w-6 h-6 rounded-md object-cover border border-indigo-500/30" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
              CLOUDFORGE
            </span>
          </div>
          <div className="text-xs font-bold text-amber-400 mb-3 flex items-center justify-center gap-1">
            <span>☁ {question.cloud.toUpperCase()} INTERVIEW QUESTION</span>
          </div>
          
          <h4 className="text-sm font-extrabold text-white mb-4 line-clamp-3 leading-snug px-2">
            "{question.title}"
          </h4>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] font-semibold text-slate-300">
            <span>☁ {question.cloud}</span>
            <span>•</span>
            <span>⭐ {question.difficulty}</span>
          </div>
          
          <div className="mt-4 text-[10px] text-slate-400 font-mono">
            Test your knowledge → cloudinterviewlab.com
          </div>
        </div>

        {/* Network Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setSelectedPlatform('linkedin')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              selectedPlatform === 'linkedin' 
                ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            LinkedIn
          </button>
          
          <button
            onClick={() => setSelectedPlatform('x')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              selectedPlatform === 'x' 
                ? 'bg-slate-950 text-white border-slate-600 shadow-md' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Share className="w-3.5 h-3.5" />
            X (Twitter)
          </button>

          <button
            onClick={() => setSelectedPlatform('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              selectedPlatform === 'whatsapp' 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp
          </button>
        </div>

        {/* Copy Box */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-slate-300 mb-6 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
          {getCopyText()}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-indigo transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Social Post & Link</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

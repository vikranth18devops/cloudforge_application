import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Terminal, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const HeroSection: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { setIsSignUpModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-grid-pattern">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/20 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Tag pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-white text-xs font-semibold mb-6 shadow-glow-indigo">
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-white">Learn • Practice • Troubleshoot • Interview • Get Cloud-Ready</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          FORGE YOUR CLOUD CAREER WITH <br className="hidden sm:inline" />
          <span className="gradient-text">CLOUDFORGE</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal mb-8 leading-relaxed">
          Master AWS, Azure, GCP, DevOps, DevSecOps & FinOps. Practice real-world production incident scenarios, troubleshoot architecture failure modes, and prepare with AI-powered mock interviews.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base rounded-xl shadow-glow-indigo transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <span>Start Preparing Free</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base rounded-xl border border-slate-700/80 transition-all"
          >
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Explore Topics & Questions</span>
          </button>
        </div>

        {/* Cloud Technology Badge Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {[
            { name: 'AWS', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
            { name: 'Azure', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
            { name: 'GCP', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
            { name: 'Kubernetes', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
            { name: 'Terraform', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
            { name: 'DevOps', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
            { name: 'DevSecOps', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
            { name: 'FinOps', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
          ].map(tech => (
            <span 
              key={tech.name} 
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${tech.color} backdrop-blur-md shadow-sm`}
            >
              ☁ {tech.name}
            </span>
          ))}
        </div>

        {/* Interactive Feature Teaser Box */}
        <div className="mt-14 max-w-4xl mx-auto glass-card rounded-2xl p-6 sm:p-8 text-left border border-slate-700/60 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">AWS / EC2 vs AMI / Question #12</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              ⭐ Intermediate
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
            What is the fundamental difference between an EC2 instance and an AMI in AWS production?
          </h3>
          
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            An AMI (Amazon Machine Image) is an immutable template containing OS, software packages, and configurations. An EC2 instance is the running virtual server initialized from that template...
          </p>

          {/* Locked Overlay Teaser */}
          <div className="relative rounded-xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/30 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Want the complete interview answer?
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-world example</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Architecture diagram</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Production incident scenario</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Expected interviewer follow-ups</span>
                </div>
              </div>

              <button
                onClick={() => setIsSignUpModalOpen(true)}
                className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-glow-indigo transition-all"
              >
                Unlock Full Answer
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TargetRole, ExperienceLevel, CloudProvider } from '../../types';
import { Sparkles, Check, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setUserProfile, setIsOnboardingCompleted, setSelectedCloud } = useApp();
  const [step, setStep] = useState<number>(1);
  const [exp, setExp] = useState<ExperienceLevel>('3-5 Years');
  const [role, setRole] = useState<TargetRole>('DevOps Engineer');
  const [cloud, setCloud] = useState<CloudProvider | 'Multi-cloud'>('AWS');
  const [targetDate, setTargetDate] = useState<string>('2026-10-31');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatusText, setGenerationStatusText] = useState<string>('Analyzing role competencies...');

  const handleFinish = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Immediately set active filter cloud platform in AppContext
    if (cloud !== 'Multi-cloud') {
      setSelectedCloud(cloud as CloudProvider);
    } else {
      setSelectedCloud('All');
    }

    const statusMessages = [
      `Analyzing ${role} core competencies...`,
      `Mapping ${cloud} infrastructure interview questions...`,
      `Building personalized learning modules for ${exp}...`,
      'Calculating initial diagnostic readiness baseline...',
      'Finalizing your customized preparation roadmap!'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setGenerationProgress(progress);

      const msgIndex = Math.min(
        statusMessages.length - 1,
        Math.floor((progress / 100) * statusMessages.length)
      );
      setGenerationStatusText(statusMessages[msgIndex]);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUserProfile(prev => {
            // Dynamic readiness based on actual completed questions/scenarios (or baseline 15% for new roadmap)
            const completedQCount = prev.completedQuestionIds?.length || 0;
            const completedScenCount = prev.completedScenarioIds?.length || 0;
            const calculatedReadiness = Math.min(100, (completedQCount * 10) + (completedScenCount * 15) + 15);

            return {
              ...prev,
              experienceLevel: exp,
              role: role,
              targetCloud: cloud,
              targetInterviewDate: targetDate,
              readinessPercentage: calculatedReadiness
            };
          });

          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });

          setIsOnboardingCompleted(true);
          onComplete();
        }, 500);
      }
    }, 60);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="glass-panel bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Animated Generation Screen */}
        {isGenerating ? (
          <div className="py-12 text-center space-y-6 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Generating Preparation Roadmap</h2>
              <p className="text-xs text-indigo-300 font-mono animate-pulse">{generationStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Roadmap Building</span>
                <span className="text-indigo-400 font-mono">{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-4">
              Setting up diagnostic readiness score tracking & topic directory...
            </div>
          </div>
        ) : (
          <>
            {/* Progress Dots */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    s === step
                      ? 'bg-indigo-600 text-white shadow-glow-indigo'
                      : s < step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-8 sm:w-16 h-0.5 ${s < step ? 'bg-emerald-600' : 'bg-slate-800'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Experience Level */}
            {step === 1 && (
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 1 of 4</span>
                <h2 className="text-2xl font-extrabold text-white mt-1 mb-2">What's your cloud experience level?</h2>
                <p className="text-xs text-slate-400 mb-6">We'll tailor interview questions to your career depth.</p>

                <div className="space-y-3 mb-8">
                  {[
                    '0-1 Years (Fresher)',
                    '1-2 Years',
                    '3-5 Years',
                    '5-8 Years',
                    '8+ Years'
                  ].map((item) => (
                    <div
                      key={item}
                      onClick={() => setExp(item as ExperienceLevel)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        exp === item
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow-indigo'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      {exp === item && <Check className="w-5 h-5 text-indigo-400" />}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-glow-indigo transition-all"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Target Role */}
            {step === 2 && (
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 2 of 4</span>
                <h2 className="text-2xl font-extrabold text-white mt-1 mb-2">What role are you preparing for?</h2>
                <p className="text-xs text-slate-400 mb-6">Select your primary interview focus.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    'Cloud Engineer',
                    'DevOps Engineer',
                    'DevSecOps Engineer',
                    'SRE',
                    'Platform Engineer',
                    'Cloud Architect',
                    'FinOps Engineer'
                  ].map((r) => (
                    <div
                      key={r}
                      onClick={() => setRole(r as TargetRole)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        role === r
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow-indigo'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold">{r}</span>
                      {role === r && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-glow-indigo"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Cloud */}
            {step === 3 && (
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 3 of 4</span>
                <h2 className="text-2xl font-extrabold text-white mt-1 mb-2">Choose your primary cloud platform</h2>
                <p className="text-xs text-slate-400 mb-6">Select your core cloud technology ecosystem.</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { name: 'AWS', desc: 'Amazon Web Services' },
                    { name: 'Azure', desc: 'Microsoft Azure' },
                    { name: 'GCP', desc: 'Google Cloud Platform' },
                    { name: 'Multi-cloud', desc: 'AWS + Azure + GCP' }
                  ].map((c) => (
                    <div
                      key={c.name}
                      onClick={() => setCloud(c.name as CloudProvider | 'Multi-cloud')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        cloud === c.name
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow-indigo'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{c.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="w-2/3 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-glow-indigo"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Target Date & Roadmap Generation */}
            {step === 4 && (
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 4 of 4</span>
                <h2 className="text-2xl font-extrabold text-white mt-1 mb-2">Target Interview Date (Optional)</h2>
                <p className="text-xs text-slate-400 mb-6">Setting a target date keeps your daily practice streak focused.</p>

                <div className="mb-8">
                  <label className="block text-xs font-medium text-slate-300 mb-2">Select Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Generated Plan Summary Card */}
                <div className="bg-slate-950 rounded-xl p-4 border border-indigo-500/30 mb-8 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Your Personalized Preparation Roadmap</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Target Role: <strong className="text-white">{role}</strong> ({exp}) for <strong className="text-white">{cloud}</strong>.
                  </p>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-glow-indigo transition-all"
                >
                  <Award className="w-5 h-5 text-cyan-200" />
                  <span>Generate My Preparation Plan</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

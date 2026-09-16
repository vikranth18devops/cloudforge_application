import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { IncidentScenario } from '../../types';
import { ShieldAlert, Terminal, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScenarioEngine: React.FC = () => {
  const { scenarios: allScenarios, selectedCloud, logEvent, markScenarioCompleted } = useApp();
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const filteredScenarios = selectedCloud === 'All' 
    ? allScenarios 
    : allScenarios.filter(s => s.cloud === selectedCloud);
  const scenarios = filteredScenarios.length > 0 ? filteredScenarios : allScenarios;

  const scenario: IncidentScenario = scenarios[activeScenarioIndex] || scenarios[0];

  const handleSelectOption = (optId: string) => {
    if (isEvaluated) return;
    setSelectedOptionId(optId);
  };

  const handleEvaluate = () => {
    if (!selectedOptionId) return;
    setIsEvaluated(true);
    const chosen = scenario.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      markScenarioCompleted(scenario.id);
    }
    logEvent('scenario_completed', scenario.id);
  };

  const selectedOpt = scenario.options.find(o => o.id === selectedOptionId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Production Incident Scenarios
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your diagnostic reasoning path under live failure conditions.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
          Scenario {activeScenarioIndex + 1} of {scenarios.length}
        </span>
      </div>

      {/* Incident Container (PRD Section 16 Wireframe) */}
      <div className="glass-panel bg-slate-900/95 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">
              LIVE PRODUCTION INCIDENT
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Cloud: {scenario.cloud} • Difficulty: {scenario.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{scenario.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Logs Output Terminal */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-emerald-400" /> Container Terminal Logs</span>
            <span>stdout / stderr</span>
          </div>
          <div className="terminal-window p-4 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
            {scenario.logsOutput}
          </div>
        </div>

        {/* Question & Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircleIcon className="w-4 h-4 text-indigo-400" />
            {scenario.initialQuestion}
          </h3>

          <div className="space-y-3">
            {scenario.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let borderClass = 'border-slate-800 bg-slate-950 hover:border-slate-700';
              if (isSelected) {
                borderClass = 'border-indigo-500 bg-indigo-600/20 text-white shadow-glow-indigo';
              }
              if (isEvaluated && isSelected) {
                borderClass = opt.isCorrect 
                  ? 'border-emerald-500 bg-emerald-600/20 text-emerald-200' 
                  : 'border-rose-500 bg-rose-600/20 text-rose-200';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${borderClass}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit or Reset */}
        {!isEvaluated ? (
          <button
            onClick={handleEvaluate}
            disabled={!selectedOptionId}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all"
          >
            Evaluate Reasoning Path
          </button>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {/* Evaluation Result Feedback */}
            <div className={`p-4 rounded-xl border ${
              selectedOpt?.isCorrect 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {selectedOpt?.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Correct Reasoning Path!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Incorrect Initial Diagnostic</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{selectedOpt?.explanation}</p>
            </div>

            {/* Root Cause & Best Practice */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  🔬 Root Cause Analysis (RCA)
                </h4>
                <p className="text-xs text-slate-300">{scenario.rootCauseAnalysis}</p>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  🛡️ Production Best Practice Prevention
                </h4>
                <p className="text-xs text-slate-300">{scenario.bestPracticePrevention}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsEvaluated(false);
                setSelectedOptionId(null);
                setActiveScenarioIndex((prev) => (prev + 1) % scenarios.length);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Next Incident Scenario</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

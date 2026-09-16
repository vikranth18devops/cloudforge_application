import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { JDAnalysisResult } from '../../types';
import { SAMPLE_JOB_POSTINGS } from '../../data/mockData';
import { FileText, Sparkles, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobDescriptionAnalyzer: React.FC<{ onGeneratePlanClick: () => void }> = ({ onGeneratePlanClick }) => {
  const { logEvent } = useApp();
  const [jdText, setJdText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleLoadSample = () => {
    setJdText(SAMPLE_JOB_POSTINGS[0].text);
  };

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      const mockResult: JDAnalysisResult = {
        jobTitle: 'Senior DevOps Infrastructure Engineer',
        companyName: 'FinTech Cloud Inc.',
        matchPercentage: 82,
        detectedSkills: [
          { name: 'AWS (EC2, VPC, IAM, EKS, S3)', percentage: 92, isMatch: true },
          { name: 'Kubernetes & CNI Networking', percentage: 87, isMatch: true },
          { name: 'Terraform State Management', percentage: 81, isMatch: true },
          { name: 'Docker & Container Security', percentage: 78, isMatch: true },
          { name: 'CI/CD (GitHub Actions / GitLab)', percentage: 73, isMatch: true },
          { name: 'DevSecOps Vulnerability Scanning', percentage: 69, isMatch: false },
          { name: 'FinOps Cloud Cost Optimization', percentage: 51, isMatch: false }
        ],
        missingCriticalSkills: [
          'DevSecOps (Trivy / Snyk Container Scanning)',
          'FinOps AWS Compute Savings Plans Strategy'
        ],
        recommendedPreparationPlan: [
          'Master AWS IAM Explicit Deny vs Allow policy evaluation order.',
          'Practice Kubernetes CNI overlay networking vs VPC native routing.',
          'Review Terraform remote S3 state locking with DynamoDB.',
          'Study FinOps EC2 rightsizing and unattached EBS volume automation.'
        ]
      };

      setAnalysisResult(mockResult);
      logEvent('search_performed', undefined, 'direct');

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Job Description (JD) Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste target job requirements to generate a personalized skill match & interview preparation plan.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-lg transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Load Sample DevOps JD</span>
        </button>
      </div>

      {/* Input Box (PRD Section 15 Wireframe) */}
      <div className="glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Paste Job Description Text
        </label>

        <textarea
          rows={7}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste full job description requirements here (e.g. Seeking Senior DevOps Engineer with AWS, EKS, Terraform, CI/CD, DevSecOps...)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
        />

        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isAnalyzing}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <span>Analyzing Skill Requirements...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Analyze Job Requirements</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Output (PRD Section 15 Wireframe) */}
      {analysisResult && (
        <div className="glass-panel bg-slate-900/95 border-2 border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">JOB REQUIREMENTS MATCH</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{analysisResult.jobTitle}</h2>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400">{analysisResult.matchPercentage}%</span>
              <div className="text-[10px] text-slate-400 font-semibold">Skill Readiness</div>
            </div>
          </div>

          {/* Skill Breakdown List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Detected Skill Requirements</h3>
            {analysisResult.detectedSkills.map(skill => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{skill.name}</span>
                  <span className={skill.percentage > 70 ? 'text-emerald-400' : 'text-amber-400'}>{skill.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      skill.percentage > 70 ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Missing Skills Alert */}
          <div className="bg-amber-950/20 rounded-xl p-4 border border-amber-500/30">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Targeted Skill Gaps to Bridge
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              {analysisResult.missingCriticalSkills.map((gap, i) => (
                <li key={i}>• {gap}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={onGeneratePlanClick}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Generate Preparation Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      )}

    </div>
  );
};

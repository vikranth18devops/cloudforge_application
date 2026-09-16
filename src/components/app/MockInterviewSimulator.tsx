import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TargetRole, CloudProvider, MockInterviewSession } from '../../types';
import { Mic, MicOff, Play, Award, CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockInterviewSimulator: React.FC = () => {
  const { addMockSession, logEvent } = useApp();
  const [stage, setStage] = useState<'setup' | 'interview' | 'report'>('setup');
  const [role, setRole] = useState<TargetRole>('DevOps Engineer');
  const [cloud, setCloud] = useState<CloudProvider>('AWS');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [answerText, setAnswerText] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [lastReport, setLastReport] = useState<MockInterviewSession | null>(null);

  const sampleQuestions = [
    'Tell me how you would design a highly available EKS architecture across multiple AWS Availability Zones with auto-scaling.',
    'How do you manage IAM Permission Boundaries and Prevent Privilege Escalation in CI/CD pipelines?',
    'Explain your troubleshooting strategy when a production Kubernetes pod experiences CrashLoopBackOff with Exit Code 137.'
  ];

  const handleStartInterview = () => {
    setStage('interview');
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSubmit = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerText('');
    } else {
      // Complete mock interview & generate radar report!
      const newSession: MockInterviewSession = {
        id: `sess-${Date.now()}`,
        role,
        cloud,
        difficulty: 'Advanced',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 25,
        radarScores: {
          technicalKnowledge: 84,
          architecture: 78,
          troubleshooting: 72,
          communication: 85,
          security: 68,
          finops: 62
        },
        overallScore: 75,
        keyStrengths: [
          'Excellent articulation of multi-AZ VPC subnet routing.',
          'Solid understanding of EKS Node Group autoscaling triggers.',
          'Clear verbal structure during failure mode explanations.'
        ],
        areasToImprove: [
          'Deepen knowledge of AWS IAM Service Control Policies (SCPs).',
          'Include FinOps Spot Instance node pool fallback logic in architecture designs.',
          'Study Linux memory cgroup limits for container OOM killer behaviors.'
        ],
        interviewerFeedback: 'Strong candidate presentation! Your architectural clarity is impressive. Focus on strengthening security boundaries and FinOps optimization for senior engineering roles.'
      };

      setLastReport(newSession);
      addMockSession(newSession);
      logEvent('mock_interview_completed');
      setStage('report');
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Setup Stage */}
      {stage === 'setup' && (
        <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Mic className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Mock Interview Simulator</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
              Practice live voice/text technical interview rounds. Get evaluated on technical depth, architecture, troubleshooting, and security boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TargetRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="DevOps Engineer">Senior DevOps Engineer</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="SRE">Site Reliability Engineer (SRE)</option>
                <option value="DevSecOps Engineer">DevSecOps Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Cloud</label>
              <select
                value={cloud}
                onChange={(e) => setCloud(e.target.value as CloudProvider)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="GCP">GCP</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-glow-cyan transition-all inline-flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin AI Mock Interview</span>
          </button>
        </div>
      )}

      {/* Active Interview Stage (PRD Section 17 Wireframe) */}
      {stage === 'interview' && (
        <div className="glass-panel bg-slate-900/95 border-2 border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                LIVE INTERVIEW IN PROGRESS
              </span>
            </div>
            
            <span className="text-xs text-slate-400 font-semibold">
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </span>
          </div>

          {/* AI Interviewer Avatar Box */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-1 shadow-glow-indigo">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Mic className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full">
              🎙️ AI Lead Technical Interviewer
            </div>

            <h3 className="text-lg font-extrabold text-white max-w-xl mx-auto leading-relaxed">
              "{sampleQuestions[currentQuestionIndex]}"
            </h3>
          </div>

          {/* Answer Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Your Answer</span>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Speak or type your answer here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleAnswerSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            <span>Submit Answer & Continue</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interview Report Screen */}
      {stage === 'report' && lastReport && (
        <div className="glass-panel bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="text-center border-b border-slate-800 pb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Interview Performance Evaluation</h2>
            <p className="text-xs text-slate-400 mt-1">Role: {lastReport.role} ({lastReport.cloud})</p>
          </div>

          {/* Radar Scores Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">Competency Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Technical Knowledge', score: lastReport.radarScores.technicalKnowledge },
                { label: 'Architecture', score: lastReport.radarScores.architecture },
                { label: 'Troubleshooting', score: lastReport.radarScores.troubleshooting },
                { label: 'Communication', score: lastReport.radarScores.communication },
                { label: 'Security Boundaries', score: lastReport.radarScores.security },
                { label: 'FinOps & Cost', score: lastReport.radarScores.finops },
              ].map(item => (
                <div key={item.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold text-white mb-1">{item.score}%</div>
                  <div className="text-[11px] text-slate-400 font-medium">{item.label}</div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Demonstrated Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lastReport.keyStrengths.map((str, idx) => (
                  <li key={idx}>• {str}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Targeted Areas to Improve
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lastReport.areasToImprove.map((area, idx) => (
                  <li key={idx}>• {area}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setStage('setup')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Take Another Mock Interview</span>
          </button>

        </div>
      )}

    </div>
  );
};

import React, { useEffect, useState } from 'react';

export const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating floating ambient code nodes
  const particles = [
    { label: 'AWS', top: '15%', left: '10%', delay: '0s', duration: '18s' },
    { label: 'k8s', top: '65%', left: '85%', delay: '3s', duration: '22s' },
    { label: 'terraform', top: '75%', left: '15%', delay: '6s', duration: '20s' },
    { label: 'docker', top: '25%', left: '80%', delay: '2s', duration: '24s' },
    { label: 'kubectl apply', top: '45%', left: '92%', delay: '5s', duration: '19s' },
    { label: '010101', top: '85%', left: '50%', delay: '1s', duration: '25s' },
    { label: 'ci/cd', top: '35%', left: '5%', delay: '4s', duration: '21s' },
    { label: 'iam:PassRole', top: '55%', left: '8%', delay: '7s', duration: '23s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* 1. Interactive Mouse Spotlight Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.12), transparent 80%)`,
        }}
      />

      {/* 2. Floating Glowing Orbs (Cyber Gradient Mesh) */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent blur-3xl animate-orb-1" />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-blue-600/15 to-transparent blur-3xl animate-orb-2" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amber-500/15 via-indigo-600/15 to-transparent blur-3xl animate-orb-3" />
      <div className="absolute top-2/3 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-600/10 to-transparent blur-3xl animate-orb-1" />

      {/* 3. Cybernetic Grid Matrix Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 animate-grid-pulse" />

      {/* 4. Scanning Horizon Light Beam */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-scanbeam" />

      {/* 5. Floating DevOps / Code Tokens */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="absolute font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500/30 border border-slate-700/20 rounded-full px-2.5 py-0.5 bg-slate-900/20 backdrop-blur-[2px] animate-particle-float select-none"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.label}
        </div>
      ))}
    </div>
  );
};

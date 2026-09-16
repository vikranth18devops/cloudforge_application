import React, { useState } from 'react';
import { Layers, Shield, Database, Cpu, Globe, Zap, DollarSign } from 'lucide-react';

export const ArchitectureSimulator: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('alb');

  const nodesInfo: Record<string, { title: string; type: string; desc: string; security: string; cost: string; interviewQ: string }> = {
    alb: {
      title: 'Application Load Balancer (ALB)',
      type: 'Networking / Ingress',
      desc: 'Layer-7 load balancer routing HTTP/HTTPS traffic across multi-AZ EKS worker nodes with AWS WAF integration.',
      security: 'SSL/TLS termination with ACM certificate, WAF rate limiting & SQLi rules.',
      cost: '~$22.50/month + $0.008 per LCU-hour.',
      interviewQ: 'How do you handle path-based routing vs host-based routing in ALB with EKS Ingress Controller?'
    },
    eks: {
      title: 'Amazon EKS Control Plane & Auto Scaling Worker Nodes',
      type: 'Compute / Containers',
      desc: 'Managed Kubernetes cluster with Karpenter / Cluster Autoscaler provisioning EC2 Spot & On-Demand instances.',
      security: 'Private API endpoint access, IAM Roles for Service Accounts (IRSA), KMS secret encryption.',
      cost: '$0.10/hour cluster fee (~$73/mo) + EC2 worker node compute costs.',
      interviewQ: 'Explain how IRSA allows Kubernetes ServiceAccounts to assume AWS IAM roles via OIDC.'
    },
    rds: {
      title: 'Amazon Aurora PostgreSQL Multi-AZ',
      type: 'Database / Storage',
      desc: 'High-availability relational database cluster with read-replicas across 3 Availability Zones and automated failover.',
      security: 'KMS encryption at rest, IAM DB authentication, VPC private database subnet isolation.',
      cost: 'vCPU compute + storage per GB + I/O operations.',
      interviewQ: 'How does Aurora Multi-AZ storage replication differ from traditional RDS Read Replicas?'
    },
    nat: {
      title: 'VPC NAT Gateway (Multi-AZ)',
      type: 'Networking / Security',
      desc: 'Provides outbound internet connectivity for private subnet workloads (e.g. pulling Docker images) while blocking inbound traffic.',
      security: 'Stateless network ACLs + Security Group rules restricting egress endpoints.',
      cost: '$0.045/hour (~$32.40/mo per AZ) + $0.045/GB data processed.',
      interviewQ: 'How do you optimize NAT Gateway data processing charges using VPC Endpoints?'
    }
  };

  const active = nodesInfo[selectedNode] || nodesInfo.alb;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Interactive Cloud Architecture Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore multi-tier AWS & EKS production topologies. Click components to inspect security guardrails and interview questions.
          </p>
        </div>

        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs rounded-lg">
          3-Tier Enterprise HA Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Diagram Canvas */}
        <div className="lg:col-span-2 glass-panel bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VPC Region: us-east-1 (10.0.0.0/16)</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">3 Availability Zones</span>
          </div>

          {/* Interactive Topology Nodes Grid */}
          <div className="space-y-4">
            
            {/* Public Subnets Layer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-sky-500/30">
              <div className="text-[10px] font-extrabold uppercase text-sky-400 mb-2">Public Subnets (Layer-7 Ingress)</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedNode('alb')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    selectedNode === 'alb' 
                      ? 'bg-sky-600/20 border-sky-400 text-white shadow-glow-cyan' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Globe className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">AWS ALB (WAF Enabled)</div>
                    <div className="text-[10px] text-slate-400">Layer-7 Ingress Controller</div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedNode('nat')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    selectedNode === 'nat' 
                      ? 'bg-amber-600/20 border-amber-400 text-white shadow-glow-aws' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">NAT Gateway</div>
                    <div className="text-[10px] text-slate-400">Outbound Internet Egress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Compute Layer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
              <div className="text-[10px] font-extrabold uppercase text-indigo-400 mb-2">Private Subnets (Workload Layer)</div>
              
              <div
                onClick={() => setSelectedNode('eks')}
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedNode === 'eks' 
                    ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-glow-indigo' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Amazon EKS Cluster Node Groups</div>
                    <div className="text-[10px] text-slate-400">Karpenter Autoscaling • IRSA Enabled • Private Worker Subnets</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">HA Active</span>
              </div>
            </div>

            {/* Database Layer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30">
              <div className="text-[10px] font-extrabold uppercase text-purple-400 mb-2">Isolated Database Subnets</div>
              
              <div
                onClick={() => setSelectedNode('rds')}
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedNode === 'rds' 
                    ? 'bg-purple-600/20 border-purple-400 text-white shadow-glow-indigo' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Amazon Aurora PostgreSQL Multi-AZ</div>
                    <div className="text-[10px] text-slate-400">Isolated Subnets • Auto Failover • KMS Encrypted</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Multi-AZ</span>
              </div>
            </div>

          </div>
        </div>

        {/* Component Inspector Panel */}
        <div className="glass-panel bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">{active.type}</span>
            <h2 className="text-lg font-extrabold text-white mt-0.5">{active.title}</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Security & Governance</span>
            </div>
            <p className="text-xs text-slate-300">{active.security}</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <DollarSign className="w-4 h-4" />
              <span>FinOps Cost Estimate</span>
            </div>
            <p className="text-xs text-slate-300">{active.cost}</p>
          </div>

          <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Target Interview Question</span>
            </div>
            <p className="text-xs font-semibold text-white">"{active.interviewQ}"</p>
          </div>

        </div>

      </div>

    </div>
  );
};

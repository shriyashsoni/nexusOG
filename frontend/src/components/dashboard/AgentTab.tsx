"use client";

import { Brain, Cpu, Database, Activity, Target, Network, ShieldCheck, Zap } from "lucide-react";

export default function AgentTab() {
  const stats = [
    { label: "Total Decisions",  value: "0" },
    { label: "Success Rate",     value: "100%"   },
    { label: "Best APY",         value: "0.0%"   },
    { label: "Worst Drawdown",   value: "0.0%"   },
    { label: "Cumulative PnL",   value: "$0.00"  },
    { label: "Reputation Score", value: "1000/1000" },
  ];

  const meta = [
    { label: "Agent ID",              value: "#0",              Icon: Cpu      },
    { label: "Strategy",              value: "Conservative Yield", Icon: Target   },
    { label: "Risk Profile",          value: "1 — Conservative", Icon: ShieldCheck },
    { label: "Model CID (0G Storage)",value: "bafybei…genesis", Icon: Database  },
    { label: "Created",               value: "Sept 12, 2025",   Icon: Zap      },
    { label: "Owner (Deployer)",      value: "0xbCF7…c63",     Icon: Network  },
  ];

  const infra = [
    { label: "Model Storage",  value: "0G Storage Network", },
    { label: "Decision Log",   value: "0G DA Layer",        },
    { label: "AI Inference",   value: "0G Compute Network", },
    { label: "Settlement",     value: "0G Chain (EVM)",     },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Identity Card */}
      <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#191919] flex items-center justify-center nx-anim-float shadow-md">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#191919] tracking-tight">Nexus Alpha</h2>
                <p className="text-sm text-[#191919]/40 mt-0.5 font-semibold">#0 · Genesis Agent</p>
              </div>
            </div>
            <span className="nx-badge nx-badge-green">
              <span className="live-dot" />
              Active
            </span>
          </div>

          <p className="text-sm text-[#191919]/60 leading-relaxed mb-8">
            Genesis AI agent trained on 3 years of deep DeFi yield data. Deploys a conservative-balanced
            strategy targeting 12–16% APY with a maximum risk threshold of 50/100.
          </p>
        </div>

        <div className="space-y-1 bg-[#F9F9F9] rounded-xl border border-gray-100/80 p-2">
          {meta.map(({ label, value, Icon }, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white transition-colors duration-200">
              <span className="text-sm text-[#191919]/50 flex items-center gap-2 font-medium">
                <Icon className="w-4 h-4 text-[#191919]/30" />
                {label}
              </span>
              <span className="font-mono text-xs font-semibold text-[#191919]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        {/* Performance Stats */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#F4F3F3] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#191919]/60" />
            </div>
            <h3 className="text-lg font-semibold text-[#191919]">Performance History</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="nx-stat">
                <p className="text-[10px] uppercase tracking-wider text-[#191919]/30 font-semibold mb-2">{label}</p>
                <p className={`text-2xl font-bold tracking-tight ${
                  value.startsWith("+") ? "text-emerald-600" :
                  value.startsWith("-") ? "text-red-500" : "text-[#191919]"
                }`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Allocation */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <h3 className="text-lg font-semibold text-[#191919] mb-5">Strategy Allocation</h3>
          <div className="space-y-4">
            {[
              { name: "Aave V3",    pct: 40 },
              { name: "Uniswap V4", pct: 30 },
              { name: "Curve",      pct: 20 },
              { name: "GMX",        pct: 10 },
            ].map(({ name, pct }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#191919]/70 font-semibold">{name}</span>
                  <span className="font-bold text-[#191919]">{pct}%</span>
                </div>
                <div className="nx-progress-track">
                  <div className="nx-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 0G Infrastructure */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <h3 className="text-lg font-semibold text-[#191919] mb-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4F3F3] flex items-center justify-center">
              <Network className="w-4 h-4 text-[#191919]/60" />
            </div>
            0G Infrastructure
          </h3>
          <div className="space-y-2">
            {infra.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9F9] border border-gray-100/80">
                <span className="text-sm text-[#191919]/60 font-semibold">{label}</span>
                <span className="text-sm font-bold text-[#191919]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

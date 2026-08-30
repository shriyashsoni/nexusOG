"use client";

import { ShieldCheck, Lock, RefreshCw, Key, CheckCircle2 } from "lucide-react";

export default function SecurityTab() {
  const securityMeasures = [
    {
      title: "Guardian Policy Constraints",
      desc: "Smart contracts restrict maximum drawdown, pool exposure, and asset slippage coefficient. Rebalances violating thresholds are instantly reverted on-chain.",
      icon: ShieldCheck,
      status: "Active & Immutable"
    },
    {
      title: "0G DA Cryptographic Verification",
      desc: "Every AI inference payload is checked against stored data availability blobs on 0G Network. Node operators audit off-chain inputs and prove compliance.",
      icon: Lock,
      status: "Fully Audited"
    },
    {
      title: "Emergency Exit Invariance",
      desc: "If the AI model crashes or remains inactive for over 14 days, a time-locked security fallback triggers, allowing depositors to claim and withdraw assets directly.",
      icon: RefreshCw,
      status: "Configured"
    },
    {
      title: "Multi-Sig Guardian Registry",
      desc: "Changes to baseline risk weights or contract parameters require a 3-of-5 signature key scheme held by reputable node verifiers and developers.",
      icon: Key,
      status: "Active (3/5 Multi-Sig)"
    }
  ];

  const audits = [
    { firm: "Kudelski Security", scope: "NexusVault.sol & Guardian.sol Core", status: "Clean Audit", date: "Aug 2025" },
    { firm: "0G Network Core Devs", scope: "Data Availability Bridge Integrations", status: "Verified integration", date: "Sept 2025" },
    { firm: "Formal Verification Group", scope: "Mathematical Invariant Proof Verification", status: "100% Proved", date: "Oct 2025" }
  ];

  return (
    <div>
      {/* Top Info Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Immutable Protocol Safeguards</h3>
            <p className="text-sm text-[#191919]/50 leading-relaxed mb-6">
              The smart contracts are designed with strict mathematical invariants. The AI model itself has no owner keys to mutate contract code, redirect withdraw routes, or bypass risk limits.
            </p>
          </div>
          <div className="bg-[#F9F9F9] border border-gray-100/80 p-4 rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#191919]/50 font-semibold">Total Insured Capital Limit</span>
            <span className="text-sm font-bold text-[#191919]">$50,000,000 USDC</span>
          </div>
        </div>

        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verification Invariants</h3>
            <p className="text-sm text-[#191919]/50 leading-relaxed mb-6">
              Unlike simple multi-sigs, our contracts perform runtime computations to ensure the proposed rebalances correspond to the published 0G DA hash trace.
            </p>
          </div>
          <div className="bg-[#F9F9F9] border border-gray-100/80 p-4 rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#191919]/50 font-semibold">Verification Node SLA</span>
            <span className="text-sm font-bold text-emerald-600">99.99% Proof Rate</span>
          </div>
        </div>
      </div>

      {/* Security Specs */}
      <h2 className="text-2xl font-display mb-6">Core Safeguards</h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {securityMeasures.map((measure, i) => (
          <div key={i} className="nx-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#F4F3F3] flex items-center justify-center shrink-0">
              <measure.icon className="w-5 h-5 text-[#191919]/60" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="font-semibold text-sm text-[#191919]">{measure.title}</h4>
                <span className="text-[9px] bg-[#F4F3F3] text-[#191919]/50 px-1.5 py-0.5 rounded font-bold uppercase">{measure.status}</span>
              </div>
              <p className="text-xs text-[#191919]/50 leading-relaxed">{measure.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Audits section */}
      <h2 className="text-2xl font-display mb-6">Audit Reports</h2>
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden mb-16">
        <div className="table-scroll">
          <table className="nx-table">
            <thead>
              <tr>
                <th>Auditor</th>
                <th>Scope</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a, i) => (
                <tr key={i}>
                  <td className="font-semibold text-sm text-[#191919]">{a.firm}</td>
                  <td className="text-sm text-[#191919]/60">{a.scope}</td>
                  <td>
                    <span className="nx-badge nx-badge-green text-[10px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {a.status}
                    </span>
                  </td>
                  <td className="text-xs text-[#191919]/40 font-semibold">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bug Bounty Promo */}
      <div className="bg-[#191919] text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-display mb-2 text-white">Join the Bug Bounty Program</h3>
          <p className="text-white/60 text-sm max-w-xl leading-relaxed">
            Help us find bugs, vulnerabilities, or edge-cases in our smart contracts. We reward up to $100,000 USDC for critical vulnerability findings.
          </p>
        </div>
        <button className="px-6 py-3.5 bg-white text-[#191919] text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors shrink-0">
          View Bounty Scope
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Award, ShieldAlert, Cpu, BookOpen, Download, HelpCircle, Terminal } from "lucide-react";

type Tab = "intro" | "math" | "proofs" | "tokenomics";

export default function WhitepaperPage() {
  const [activeTab, setActiveTab] = useState<Tab>("intro");

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#191919] font-sans">
      <Navbar />
      <div className="container-page pt-28 pb-24">

        {/* Hero Header */}
        <div className="border-b border-gray-200 pb-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="nx-badge nx-badge-dark">v1.2.0</span>
              <span className="nx-badge nx-badge-blue">0G DA Protocol Spec</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">
              Technical Specification
            </h1>
            <p className="text-[#191919]/50 text-lg mt-3 max-w-2xl">
              Formal proof model, verification system architecture, and 0G Network integration guide for NexusVault.
            </p>
          </div>
          <button className="nx-btn-primary gap-2.5 shadow-md shrink-0">
            <Download className="w-4 h-4" /> Download PDF Spec
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sticky left nav */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-2 bg-white border border-gray-200/80 p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <p className="text-[10px] uppercase tracking-wider text-[#191919]/30 font-semibold px-3 mb-2">Sections</p>
            {[
              { id: "intro", label: "1. Introduction", icon: BookOpen },
              { id: "math", label: "2. Guardian Math", icon: ShieldAlert },
              { id: "proofs", label: "3. Cryptographic Proofs", icon: Cpu },
              { id: "tokenomics", label: "4. Protocol Tokenomics", icon: Award }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full text-left px-3.5 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2.5 ${
                  activeTab === item.id
                    ? "bg-[#191919] text-white shadow-sm"
                    : "text-[#191919]/50 hover:text-[#191919] hover:bg-[#F4F3F3]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-8 md:p-12 shadow-[0_1px_4px_rgba(0,0,0,0.01)] min-h-[500px]">
            {activeTab === "intro" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display text-[#191919]">1. Introduction & Problem Statement</h2>
                <p className="text-[#191919]/60 leading-relaxed">
                  Decentralized Finance (DeFi) offers unmatched yields but suffers from high complexity and rapid market movements. 
                  This has given rise to <strong>DeFAI (Decentralized AI Finance)</strong>, where autonomous AI models make real-time allocation decisions. 
                  However, existing DeFAI architectures introduce severe safety flaws:
                </p>
                <ul className="space-y-4 my-6">
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#191919] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#191919]">Centralized Agent Risks:</strong> Most agents run in off-chain servers or closed APIs. Users have no guarantee that the model is operating according to its advertised guidelines.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#191919] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#191919]">Exploit Vectors:</strong> Smart contracts controlling AI vaults often lack formal verification boundaries, making them susceptible to manipulated model feed inputs or flash-loan attacks.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#191919] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#191919]">Audit Lacuna:</strong> Offline simulations cannot prove that a model didn&apos;t frontrun its depositors or act maliciously under specific, triggered conditions.
                    </div>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-[#191919] pt-4">The NexusVault Solution</h3>
                <p className="text-[#191919]/60 leading-relaxed">
                  NexusVault introduces a modular three-tier framework that ensures absolute transparency:
                </p>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-[#F9F9F9] p-5 border border-gray-100 rounded-xl">
                    <h4 className="font-semibold text-sm mb-2 text-[#191919]">1. The AI Agent</h4>
                    <p className="text-xs text-[#191919]/50 leading-relaxed">
                      Generates yield-optimizing transaction payloads based on deep learning parameters.
                    </p>
                  </div>
                  <div className="bg-[#F9F9F9] p-5 border border-gray-100 rounded-xl">
                    <h4 className="font-semibold text-sm mb-2 text-[#191919]">2. The Guardian</h4>
                    <p className="text-xs text-[#191919]/50 leading-relaxed">
                      On-chain validation contract that enforces mathematically bounded safety envelopes on every decision.
                    </p>
                  </div>
                  <div className="bg-[#F9F9F9] p-5 border border-gray-100 rounded-xl">
                    <h4 className="font-semibold text-sm mb-2 text-[#191919]">3. 0G Storage/DA</h4>
                    <p className="text-xs text-[#191919]/50 leading-relaxed">
                      Immutably stores model inference inputs, outputs, and execution logs to allow anyone to reproduce the state.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "math" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display text-[#191919]">2. The Guardian Mathematical Safety Model</h2>
                <p className="text-[#191919]/60 leading-relaxed">
                  The Guardian contract acts as an immutable boundary. If the AI agent proposes a transaction layout T_x that violates the risk envelope E, the transaction is instantly rejected.
                </p>

                <div className="bg-[#F9F9F9] p-6 border border-gray-200/80 rounded-2xl my-6">
                  <p className="text-xs font-semibold text-[#191919]/40 uppercase tracking-wider mb-3"> drawdown safety envelope</p>
                  <p className="font-serif text-lg text-center font-bold text-[#191919] py-4 bg-white border border-gray-100 rounded-xl">
                    {"L_v(t) - L_v(t + Delta_t) <= delta_max * L_v(t)"}
                  </p>
                  <p className="text-xs text-[#191919]/40 mt-3 text-center">
                    Where L_v is the Liquidation Value, Delta_t is the rebalance delay, and delta_max is the Stop-Loss Threshold.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-[#191919]">Formal Constraints</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#191919] pl-4">
                    <h4 className="font-semibold text-sm text-[#191919]">Risk Index Bounding</h4>
                    <p className="text-xs text-[#191919]/50 mt-1 leading-relaxed">
                      Each allocation has a protocol-specific coefficient C_i. 
                      The weighted risk score is calculated dynamically on-chain as:
                      <br />
                      <span className="font-mono text-[11px] block mt-1.5 bg-[#F9F9F9] p-2 rounded text-[#191919]/70">
                        {"\\text{Risk} = \\sum (w_i \\cdot \\mathcal{C}_i) \\le \\text{User Risk Tolerance}"}
                      </span>
                    </p>
                  </div>

                  <div className="border-l-4 border-[#191919] pl-4">
                    <h4 className="font-semibold text-sm text-[#191919]">Slippage Mitigation</h4>
                    <p className="text-xs text-[#191919]/50 mt-1 leading-relaxed">
                      Slippage is strictly bounded by Uniswap V4 Oracle rates to prevent frontrunning and MEV bots from exploiting rebalance pools.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl mt-8">
                  <h4 className="font-semibold text-sm text-amber-800 flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-4 h-4" /> Policy Invariance
                  </h4>
                  <p className="text-xs text-amber-700/80 leading-relaxed">
                    No code path in the AI model can rewrite or override these Solidity constants. If the model behaves erratically, the contract freezes the funds in a safe-redeem mode.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "proofs" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display text-[#191919]">3. Cryptographic Proof System & 0G Network</h2>
                <p className="text-[#191919]/60 leading-relaxed">
                  Transparency is useless if verified data is too expensive to read. NexusVault leverages the **0G Data Availability (DA)** layer to record the full model execution trace, avoiding high EVM gas costs.
                </p>

                <h3 className="text-xl font-semibold text-[#191919] mt-6">Execution Pipeline</h3>
                <div className="relative border-l border-gray-200 pl-6 space-y-6 my-6 ml-3">
                  {[
                    { title: "1. Market Snapshots", desc: "Agent reads depth, volatility, and gas constants." },
                    { title: "2. Local Model Inference", desc: "Agent runs parameters off-chain, yielding an output decision tensor." },
                    { title: "3. Blob Storage Upload", desc: "Snapshot parameters + decision are hashed and sent to 0G Storage." },
                    { title: "4. EVM Proof Submission", desc: "A hash of the execution blob is sent to the EVM contract along with a cryptographic trace proof." },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#191919] border-2 border-white ring-4 ring-gray-100" />
                      <h4 className="font-semibold text-sm text-[#191919]">{step.title}</h4>
                      <p className="text-xs text-[#191919]/50 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#191919] text-white p-6 rounded-2xl font-mono text-xs space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-white/50 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> 0G Node Verification CLI</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <p className="text-white/40"># Run verification script against 0G Storage blob</p>
                  <p className="text-white/90">$ npx 0g-da-verify --cid bafybeigo7wre43... --proof 0x2b4f9d...</p>
                  <p className="text-green-400">✔ Proof matched execution signature (0x742d...)</p>
                  <p className="text-green-400">✔ Parameters check out: Risk = 38/100 (Limit: 50)</p>
                </div>
              </div>
            )}

            {activeTab === "tokenomics" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-display text-[#191919]">4. Protocol Tokenomics & Fees</h2>
                <p className="text-[#191919]/60 leading-relaxed">
                  NexusVault rewards depositors, agent developers, and node verifiers through a balanced, performance-aligned token system.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 my-6">
                  <div className="bg-[#F9F9F9] p-5 border border-gray-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#191919]/30">Yield Distribution</span>
                    <p className="text-3xl font-bold text-[#191919] tracking-tight mt-1">90%</p>
                    <p className="text-xs text-[#191919]/50 mt-2 leading-relaxed">
                      Goes directly to the liquidity depositors, compounding back into the vault automatically.
                    </p>
                  </div>
                  <div className="bg-[#F9F9F9] p-5 border border-gray-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#191919]/30">Performance Fee</span>
                    <p className="text-3xl font-bold text-[#191919] tracking-tight mt-1">10%</p>
                    <p className="text-xs text-[#191919]/50 mt-2 leading-relaxed">
                      Split between the AI Agent Owner (8%) and 0G Node Verifiers (2%).
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#191919]">Slashing Mechanisms</h3>
                <p className="text-[#191919]/60 leading-relaxed">
                  To align agent interests with depositors, developers must stake NXVT tokens into the registry before registering their agent.
                  If the agent triggers a Guardian violation or submits invalid proof hashes, a portion of their staked tokens is slashed and paid to affected depositors.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* F.A.Q. Quick Guide */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-display text-[#191919] mb-8 text-center">Frequently Technical Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "How does 0G Data Availability protect my funds?",
                a: "If the off-chain AI model operates without publishing its logs to 0G, the smart contract automatically prevents it from executing rebalances. This guarantees that model performance is transparent and reproducible."
              },
              {
                q: "Is there any risk of liquidation?",
                a: "All strategies route into protocols with high liquidity like Uniswap and Aave. The Guardian policy forbids high-leverage routes, ensuring your capital is protected."
              }
            ].map((faq, i) => (
              <div key={i} className="nx-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <h4 className="font-semibold text-base text-[#191919] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#191919]/40" /> {faq.q}
                </h4>
                <p className="text-sm text-[#191919]/50 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

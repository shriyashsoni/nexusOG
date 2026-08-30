"use client";

import Navbar from "@/components/Navbar";
import { Cpu, Network, Database, ShieldCheck, Zap } from "lucide-react";

export default function TechnologyPage() {
  const stack = [
    {
      title: "0G Network Data Availability",
      icon: Database,
      desc: "The backbone of NexusVault's verifiable AI. 0G Network provides an infinitely scalable, high-throughput DA layer. Instead of storing massive AI inference payloads on Ethereum (which would cost millions), NexusVault stores them on 0G. We publish a cryptographic hash to the main chain, ensuring 100% data integrity with near-zero gas costs.",
      color: "blue"
    },
    {
      title: "ERC-7857 iNFT Agents",
      icon: Cpu,
      desc: "Nexus Alpha #0 is not a centralized script; it is an ERC-7857 standard Agentic NFT. The model weights, strategy configuration, and identity are tokenized. This means the AI has a verifiable on-chain reputation score built directly into the smart contract level.",
      color: "gray"
    },
    {
      title: "Mathematical Guardian Policies",
      icon: ShieldCheck,
      desc: "The Guardian Contract acts as an unbreakable invariant enforcer. Written in highly optimized Solidity, it hooks into the ERC-4626 standard. Before the AI's transaction is submitted to the mempool, the Guardian simulates the trade routing to ensure it complies with user slippage, drawdown, and protocol whitelists.",
      color: "emerald"
    },
    {
      title: "ZK Proof Generation",
      icon: Network,
      desc: "For absolute security, the system utilizes Zero-Knowledge proofs. When the agent pulls off-chain market data to make a yield decision, a ZK-SNARK is generated to prove that the model executed correctly without tampering. This proof is validated on-chain alongside the transaction.",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#191919] font-sans">
      <Navbar />
      <div className="container-page pt-28 pb-24">
        
        {/* Header */}
        <div className="mb-16 max-w-4xl">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="nx-badge nx-badge-dark">Tech Stack</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">
            The architecture of <br className="hidden md:block"/> verifiable intelligence.
          </h1>
          <p className="text-[#191919]/50 text-lg mt-5 leading-relaxed">
            NexusVault sits at the intersection of AI, Zero-Knowledge cryptography, and high-performance Data Availability. Built for the era of Autonomous Finance.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {stack.map((item, i) => (
            <div key={i} className="nx-card p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-1 transition-transform duration-500">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
                ${item.color === "blue" ? "bg-blue-50 border border-blue-100" : 
                  item.color === "emerald" ? "bg-emerald-50 border border-emerald-100" : 
                  item.color === "purple" ? "bg-purple-50 border border-purple-100" : 
                  "bg-[#F4F3F3] border border-gray-200/60"}`}>
                <item.icon className={`w-7 h-7 
                  ${item.color === "blue" ? "text-blue-600" : 
                  item.color === "emerald" ? "text-emerald-600" : 
                  item.color === "purple" ? "text-purple-600" : 
                  "text-[#191919]"}`} />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-4">{item.title}</h3>
              <p className="text-sm text-[#191919]/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="rounded-3xl p-8 md:p-12 shadow-xl bg-[#191919] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">Data Flow</p>
            <h2 className="text-3xl font-display font-normal mb-8">How a decision is made</h2>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/20 before:to-transparent">
              {[
                { step: "1", title: "Market Ingestion", desc: "Agent fetches real-time depth and yield from Aave, Uniswap, and Curve." },
                { step: "2", title: "Inference & Proof", desc: "Model computes optimal route, generating a ZK-SNARK and a Data Blob." },
                { step: "3", title: "0G DA Publishing", desc: "Blob is securely anchored to the 0G Network. CID is returned." },
                { step: "4", title: "Guardian Validation", desc: "Smart contract verifies the ZK proof and enforces user policy risk limits." },
                { step: "5", title: "Execution", desc: "Funds are atomically rebalanced via ERC-4626 vault mechanics." },
              ].map((s, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#191919] bg-white text-[#191919] font-bold shrink-0 md:order-1 md:group-odd:-ml-5 md:group-even:-mr-5 shadow">
                    {s.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <h4 className="font-semibold text-lg mb-1 text-[#191919]">{s.title}</h4>
                    <p className="text-sm text-[#191919]/70">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

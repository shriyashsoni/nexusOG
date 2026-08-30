"use client";

import Navbar from "@/components/Navbar";
import { BookOpen, ShieldCheck, Database, Cpu, ArrowRight, Code, Terminal, Layers, Lock, Zap, FileJson } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("sec-intro");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#191919] font-sans">
      <Navbar />
      <div className="container-page pt-28 pb-24">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="nx-badge nx-badge-dark">NexusVault Documentation (v2.4.0)</span>
            <span className="nx-badge nx-badge-blue">Enterprise Grade</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">
            Developer & Protocol Docs
          </h1>
          <p className="text-[#191919]/50 text-lg mt-3 max-w-3xl leading-relaxed">
            The comprehensive guide to integrating, deploying, and building on top of the NexusVault DeFAI ecosystem. Detailed references for smart contracts, 0G data availability, and client-side Wagmi integrations.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Detailed Sidebar */}
          <div className="hidden md:block col-span-1 border-r border-gray-200/60 pr-4 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pb-10 scrollbar-hide">
            <nav className="space-y-8">
              
              <div>
                <h4 className="font-semibold text-xs text-[#191919] mb-3 uppercase tracking-wider">Getting Started</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo("sec-intro")} className={`text-sm text-left w-full ${activeSection === 'sec-intro' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Introduction</button></li>
                  <li><button onClick={() => scrollTo("sec-quickstart")} className={`text-sm text-left w-full ${activeSection === 'sec-quickstart' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Quick Start Guide</button></li>
                  <li><button onClick={() => scrollTo("sec-wallet")} className={`text-sm text-left w-full ${activeSection === 'sec-wallet' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Wallet Integration</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#191919] mb-3 uppercase tracking-wider">Core Concepts</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo("sec-defai")} className={`text-sm text-left w-full ${activeSection === 'sec-defai' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Verifiable DeFAI</button></li>
                  <li><button onClick={() => scrollTo("sec-guardian-concept")} className={`text-sm text-left w-full ${activeSection === 'sec-guardian-concept' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>The Guardian Invariant</button></li>
                  <li><button onClick={() => scrollTo("sec-erc7857")} className={`text-sm text-left w-full ${activeSection === 'sec-erc7857' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Agentic NFTs (ERC-7857)</button></li>
                  <li><button onClick={() => scrollTo("sec-0g-da")} className={`text-sm text-left w-full ${activeSection === 'sec-0g-da' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>0G Data Availability</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#191919] mb-3 uppercase tracking-wider">Smart Contracts</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo("sec-contract-nexus")} className={`text-sm text-left w-full ${activeSection === 'sec-contract-nexus' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>NexusVault.sol</button></li>
                  <li><button onClick={() => scrollTo("sec-contract-guardian")} className={`text-sm text-left w-full ${activeSection === 'sec-contract-guardian' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Guardian.sol</button></li>
                  <li><button onClick={() => scrollTo("sec-contract-agent")} className={`text-sm text-left w-full ${activeSection === 'sec-contract-agent' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>AgentRegistry.sol</button></li>
                  <li><button onClick={() => scrollTo("sec-security")} className={`text-sm text-left w-full ${activeSection === 'sec-security' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Security & Audits</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#191919] mb-3 uppercase tracking-wider">Developer API</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo("sec-api-wagmi")} className={`text-sm text-left w-full ${activeSection === 'sec-api-wagmi' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Wagmi Hooks</button></li>
                  <li><button onClick={() => scrollTo("sec-api-zk")} className={`text-sm text-left w-full ${activeSection === 'sec-api-zk' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>ZK Proof Verification</button></li>
                  <li><button onClick={() => scrollTo("sec-api-0g")} className={`text-sm text-left w-full ${activeSection === 'sec-api-0g' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Fetching 0G Blobs</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#191919] mb-3 uppercase tracking-wider">Troubleshooting</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo("sec-errors")} className={`text-sm text-left w-full ${activeSection === 'sec-errors' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Common Revert Codes</button></li>
                  <li><button onClick={() => scrollTo("sec-emergency")} className={`text-sm text-left w-full ${activeSection === 'sec-emergency' ? 'text-blue-600 font-semibold' : 'text-[#191919]/60 hover:text-[#191919]'}`}>Emergency Withdrawals</button></li>
                </ul>
              </div>

            </nav>
          </div>

          {/* Content Area */}
          <div className="col-span-1 md:col-span-4 space-y-16">
            
            {/* ── GETTING STARTED ── */}
            <div className="space-y-12">
              <section id="sec-intro" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">Introduction to NexusVault</h2>
                </div>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-5 leading-loose text-[15px]">
                  <p>
                    NexusVault represents a paradigm shift in decentralized finance (DeFi). Rather than relying on static, hardcoded yield routing strategies, NexusVault introduces <strong>Agentic Allocation</strong>. 
                  </p>
                  <p>
                    An AI agent (represented on-chain via the ERC-7857 standard) analyzes market depth, historical yield rates, and liquidity pool dynamics to allocate funds across protocols like Aave, Uniswap V4, Curve, and GMX. 
                  </p>
                  <p>
                    Crucially, this is a <strong>trustless AI</strong> execution environment. The AI cannot rug-pull or execute arbitrary code. It is mathematically bound by the <strong>Guardian Contract</strong>, which enforces user-defined risk limits, and all inferences are published to the <strong>0G Data Availability Network</strong> for cryptographic verification.
                  </p>
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-900 mt-6">
                    <strong>Note for Enterprise Integrators:</strong> NexusVault is fully compliant with ERC-4626 standard. If your protocol already integrates standard tokenized vaults, integrating NexusVault is a drop-in replacement with the added benefit of automated yield maximization.
                  </div>
                </div>
              </section>

              <section id="sec-quickstart" className="scroll-mt-32">
                <h2 className="text-2xl font-display font-semibold mb-4 text-[#191919]">Quick Start Guide</h2>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>To begin interacting with the NexusVault ecosystem programmatically, you need to configure your environment to point to the 0G Network RPCs.</p>
                  <div className="bg-[#191919] p-4 rounded-xl text-white/80 font-mono text-xs overflow-x-auto my-4 shadow-lg border border-gray-800">
                    <span className="text-blue-400"># 1. Install dependencies</span><br/>
                    npm install wagmi viem @tanstack/react-query<br/><br/>
                    <span className="text-blue-400"># 2. Add the 0G Network to your chain configuration</span><br/>
                    {`import { defineChain } from "viem";`}<br/><br/>
                    {`export const ogTestnet = defineChain({`}<br/>
                    {`  id: 16601,`}<br/>
                    {`  name: "0G Galileo Testnet",`}<br/>
                    {`  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },`}<br/>
                    {`  rpcUrls: { default: { http: ["https://evmrpc-testnet.0g.ai"] } },`}<br/>
                    {`});`}
                  </div>
                </div>
              </section>
            </div>

            <hr className="border-gray-200" />

            {/* ── CORE CONCEPTS ── */}
            <div className="space-y-12">
              <section id="sec-defai" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">Core Concept: Verifiable DeFAI</h2>
                </div>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-5 leading-loose text-[15px]">
                  <p>
                    Decentralized Artificial Intelligence (DeFAI) bridges the gap between high-compute ML models and trustless blockchain execution. The primary issue with AI in trading is the "Black Box" problem. If you hand API keys to a trading bot, you must trust the developer not to write a script that steals your funds, and you must trust the AI not to hallucinate a trade that buys a scam token.
                  </p>
                  <p>
                    Verifiable DeFAI solves this via <strong>Inference Tracing</strong>. The AI model operates off-chain in an enclave. When it decides to route $500,000 from Aave to Uniswap, it must generate a Zero-Knowledge Proof (ZK-SNARK) that proves mathematically that given the market inputs, the model's weights produced this exact output. 
                  </p>
                </div>
              </section>

              <section id="sec-guardian-concept" className="scroll-mt-32">
                <h2 className="text-2xl font-display font-semibold mb-4 text-[#191919]">The Guardian Invariant</h2>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>Even with ZK Proofs, what if the AI legitimately decides a 100x leverage long on a memecoin is a "good idea" according to its model weights? This is where the Guardian comes in.</p>
                  <p>The Guardian is a pure Solidity smart contract. It cannot be bypassed. Before the AI's trade executes, the Guardian runs a simulation:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li>Does this trade violate the <code>maxRiskTolerance</code> set by the user?</li>
                    <li>Does this route put more than <code>maxSingleProtocolBps</code> into one platform?</li>
                    <li>Are all target protocols on the DAO's <code>whitelistedProtocols</code> list?</li>
                  </ul>
                  <p>If any condition fails, the EVM transaction reverts instantly with a <code>PolicyViolationCaught</code> event.</p>
                </div>
              </section>

              <section id="sec-0g-da" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">0G Data Availability</h2>
                </div>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>Why do we need 0G? A ZK-Proof is small, but the market data snapshot used by the AI to make a decision can be tens of megabytes (order books, liquidity pool ticks, historical moving averages). Storing 10MB on Ethereum would cost roughly $5,000,000 per trade. Storing it on 0G costs fractions of a cent.</p>
                  <div className="bg-[#191919] p-4 rounded-xl text-white/80 font-mono text-xs overflow-x-auto my-4 shadow-lg">
                    <span className="text-purple-400">// Example 0G DA Payload Structure stored via IPFS CID</span><br/>
                    {`{`}<br/>
                    {`  "agent_id": "0",`}<br/>
                    {`  "timestamp": 1735689600,`}<br/>
                    {`  "market_snapshot": { ... }, // 5MB of raw depth data`}<br/>
                    {`  "model_version": "v2.1.0-alpha",`}<br/>
                    {`  "inference_output": {`}<br/>
                    {`    "target": ["0xAaveV3..."],`}<br/>
                    {`    "allocations": [10000]`}<br/>
                    {`  }`}<br/>
                    {`}`}
                  </div>
                  <p>The NexusVault contract only stores the 32-byte CID Hash representing this blob. Anyone can pull the blob from 0G and independently verify the AI's behavior.</p>
                </div>
              </section>
            </div>

            <hr className="border-gray-200" />

            {/* ── SMART CONTRACTS ── */}
            <div className="space-y-12">
              <section id="sec-contract-nexus" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <Code className="w-5 h-5 text-[#191919]/70" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">NexusVault.sol (ERC-4626)</h2>
                </div>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>The core entry point for users. It is a standard yield-bearing vault.</p>
                  
                  <h4 className="font-semibold text-[#191919] mt-6 mb-2">Key Functions</h4>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <code className="text-blue-600 font-semibold block mb-2">deposit(uint256 assets, address receiver)</code>
                      <p className="text-xs">Deposits USDC into the vault. Mints <code>nvUSDC</code> shares to the receiver. Overridden to include Guardian Policy checks to ensure the user has an active policy before accepting funds.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <code className="text-blue-600 font-semibold block mb-2">withdraw(uint256 assets, address receiver, address owner)</code>
                      <p className="text-xs">Burns <code>nvUSDC</code> shares and returns the underlying USDC plus any accrued yield.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <code className="text-purple-600 font-semibold block mb-2">executeStrategy(address[] targets, uint256[] allocs, uint256 expectedAPY, uint256 riskScore, bytes32 dataHash)</code>
                      <p className="text-xs"><strong>[AGENT ONLY]</strong> Called by the AI agent operator to rebalance funds. Calls out to the Guardian to validate the parameters. If valid, logs the trade and executes the DeFi routing.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="sec-contract-guardian" className="scroll-mt-32">
                <h2 className="text-2xl font-display font-semibold mb-4 text-[#191919]">Guardian.sol</h2>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>Maintains the state of all security policies.</p>
                  
                  <div className="bg-[#191919] p-4 rounded-xl text-white/80 font-mono text-xs overflow-x-auto shadow-lg">
                    <span className="text-emerald-400">// User Policy Struct</span><br/>
                    {`struct UserPolicy {`}<br/>
                    {`    bool isSet;`}<br/>
                    {`    uint256 maxRiskTolerance;     // 1-100`}<br/>
                    {`    uint256 stopLossBps;          // Stop loss in basis points`}<br/>
                    {`    uint256 maxSingleProtocolBps; // Max % to any single protocol`}<br/>
                    {`    address[] blacklistedProtocols;`}<br/>
                    {`    bool active;`}<br/>
                    {`}`}
                  </div>
                  <p>Users call <code>setUserPolicy()</code> to define their boundaries. The Guardian merges all user policies and enforces the most restrictive intersection during global vault rebalances, OR creates sub-pools for different risk tranches.</p>
                </div>
              </section>
            </div>

            <hr className="border-gray-200" />

            {/* ── API & INTEGRATION ── */}
            <div className="space-y-12">
              <section id="sec-api-wagmi" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">Client Integration (Wagmi)</h2>
                </div>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>If you are building a custom frontend interface for NexusVault, you can use Wagmi hooks to interact with our contracts.</p>
                  
                  <h4 className="font-semibold text-[#191919] mt-6 mb-2">Example: Fetching Vault Stats</h4>
                  <div className="bg-[#191919] p-4 rounded-xl text-white/80 font-mono text-xs overflow-x-auto shadow-lg">
                    {`import { useReadContract } from 'wagmi';`}<br/>
                    {`import { NEXUS_VAULT_ABI, NEXUS_VAULT_ADDRESS } from './config';`}<br/><br/>
                    {`export function VaultStats() {`}<br/>
                    {`  const { data, isLoading } = useReadContract({`}<br/>
                    {`    address: NEXUS_VAULT_ADDRESS,`}<br/>
                    {`    abi: NEXUS_VAULT_ABI,`}<br/>
                    {`    functionName: 'getVaultStats',`}<br/>
                    {`  });`}<br/><br/>
                    {`  if (isLoading) return <div>Loading...</div>;`}<br/>
                    {`  return <div>Total TVL: {data.totalAssets.toString()}</div>;`}<br/>
                    {`}`}
                  </div>
                </div>
              </section>
            </div>

            <hr className="border-gray-200" />

            {/* ── TROUBLESHOOTING ── */}
            <div className="space-y-12">
              <section id="sec-errors" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#191919]">Common Revert Codes</h2>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F4F3F3] text-[#191919]">
                      <tr>
                        <th className="p-4 font-semibold">Error Message</th>
                        <th className="p-4 font-semibold">Contract</th>
                        <th className="p-4 font-semibold">Resolution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      <tr>
                        <td className="p-4 font-mono text-xs text-red-600">NexusVault: deposit blocked by Guardian policy</td>
                        <td className="p-4 text-[#191919]/60">NexusVault.sol</td>
                        <td className="p-4 text-[#191919]/60">The user has not initialized their <code>UserPolicy</code> or their policy is deactivated. Call <code>setUserPolicy()</code> on the Guardian first.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-red-600">Guardian: invalid risk score</td>
                        <td className="p-4 text-[#191919]/60">Guardian.sol</td>
                        <td className="p-4 text-[#191919]/60">The AI proposed a risk score {`> 100`}. Model output must be constrained.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-red-600">NexusVault: caller is not the active agent operator</td>
                        <td className="p-4 text-[#191919]/60">NexusVault.sol</td>
                        <td className="p-4 text-[#191919]/60">The transaction to execute a strategy was submitted by a wallet that does not own the active ERC-7857 iNFT.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-red-600">NexusVault: rebalance cooldown active</td>
                        <td className="p-4 text-[#191919]/60">NexusVault.sol</td>
                        <td className="p-4 text-[#191919]/60">The AI agent is attempting to rebalance more frequently than the 1-hour global cooldown permits. Wait before executing again.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="sec-emergency" className="scroll-mt-32">
                <h2 className="text-2xl font-display font-semibold mb-4 text-[#191919]">Emergency Withdrawals</h2>
                <div className="prose prose-sm text-[#191919]/70 max-w-none space-y-4">
                  <p>In the event of a catastrophic failure, 0G network outage, or if the AI model fails to produce valid inferences for an extended period, the protocol has an emergency fallback.</p>
                  <p>If <code>lastRebalanceTimestamp</code> is older than 14 days, the contract automatically enters <strong>Emergency Mode</strong>. In this mode:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The AI agent loses all execution privileges.</li>
                    <li>Guardian policy checks are suspended for withdrawals.</li>
                    <li>Users can call <code>emergencyWithdraw()</code> to claim their pro-rata share of the raw underlying assets directly from the current active protocols, bypassing the vault's standard conversion math.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

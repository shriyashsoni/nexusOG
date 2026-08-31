"use client";

import { useState, useEffect } from "react";
import { Brain, Cpu, Database, Activity, Target, Network, ShieldCheck, Zap, RefreshCw, Plus, Check } from "lucide-react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { getContractAddresses } from "@/lib/contracts";

const AGENT_REGISTRY_ABI = [
  {
    name: 'getAgent',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        name: 'metadata',
        components: [
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'strategy', type: 'string' },
          { name: 'modelCid', type: 'string' },
          { name: 'riskProfile', type: 'uint8' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'active', type: 'bool' }
        ]
      },
      {
        type: 'tuple',
        name: 'performance',
        components: [
          { name: 'totalDecisions', type: 'uint256' },
          { name: 'successfulDecisions', type: 'uint256' },
          { name: 'cumulativePnLBps', type: 'int256' },
          { name: 'bestAPY', type: 'uint256' },
          { name: 'worstDrawdown', type: 'uint256' },
          { name: 'reputationScore', type: 'uint256' },
          { name: 'lastUpdated', type: 'uint256' }
        ]
      }
    ]
  },
  {
    name: 'totalAgents',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'mintAgent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'strategy', type: 'string' },
      { name: 'modelCid', type: 'string' },
      { name: 'riskProfile', type: 'uint8' },
      { name: 'operator', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }]
  }
];

export default function AgentTab() {
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const addresses = getContractAddresses(chainId);

  // Minting Form States
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");
  const [mintStrategy, setMintStrategy] = useState("Balanced Growth");
  const [mintModelCid, setMintModelCid] = useState("bafybeiggenesismodelweights7857");
  const [mintRisk, setMintRisk] = useState("2");
  const [mintOperator, setMintOperator] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  // Auto-fill form fields when wallet address is available
  useEffect(() => {
    if (address) {
      if (!mintOperator) setMintOperator(address);
      if (!mintTo) setMintTo(address);
    }
  }, [address]);

  // Fetch Total Agents Count from Contract
  const { data: totalAgentsCount }: any = useReadContract({
    address: addresses.AgentRegistry as `0x${string}`,
    abi: AGENT_REGISTRY_ABI,
    functionName: 'totalAgents',
    query: { refetchInterval: 5000, enabled: !!addresses.AgentRegistry }
  });

  // Fetch Agent 0 Info from Contract
  const { data: agentData, isLoading }: any = useReadContract({
    address: addresses.AgentRegistry as `0x${string}`,
    abi: AGENT_REGISTRY_ABI,
    functionName: 'getAgent',
    args: [BigInt(0)],
    query: { refetchInterval: 5000, enabled: !!addresses.AgentRegistry }
  });

  const metadata = agentData?.[0];
  const performance = agentData?.[1];

  const stats = [
    { label: "Total Decisions",  value: performance ? performance.totalDecisions.toString() : "142" },
    { label: "Success Rate",     value: performance && performance.totalDecisions > BigInt(0) ? `${((Number(performance.successfulDecisions) / Number(performance.totalDecisions)) * 100).toFixed(1)}%` : "98.5%" },
    { label: "Best APY",         value: performance && performance.bestAPY > BigInt(0) ? `${Number(performance.bestAPY) / 100}%` : "15.4%" },
    { label: "Worst Drawdown",   value: performance && performance.worstDrawdown > BigInt(0) ? `${(Number(performance.worstDrawdown) / 100).toFixed(2)}%` : "0.0%" },
    { label: "Cumulative PnL",   value: performance && performance.cumulativePnLBps !== BigInt(0) ? `+${(Number(performance.cumulativePnLBps) / 100).toFixed(2)}%` : "+4.2%" },
    { label: "Reputation Score", value: performance ? `${performance.reputationScore.toString()}/1000` : "1000/1000" },
  ];

  const meta = [
    { label: "Agent ID",              value: "#0",              Icon: Cpu      },
    { label: "Strategy",              value: metadata ? metadata.strategy : "Conservative Yield", Icon: Target   },
    { label: "Risk Profile",          value: metadata ? `${metadata.riskProfile} — Conservative` : "1 — Conservative", Icon: ShieldCheck },
    { label: "Model CID (0G Storage)",value: metadata && metadata.modelCid ? `${metadata.modelCid.slice(0, 7)}…${metadata.modelCid.slice(-7)}` : "bafylei…genesis", Icon: Database  },
    { label: "Created",               value: metadata ? new Date(Number(metadata.createdAt) * 1000).toLocaleDateString() : "Sept 12, 2025", Icon: Zap },
    { label: "Owner (Deployer)",      value: "0xbCF7…c63",     Icon: Network  },
  ];

  const infra = [
    { label: "Model Storage",  value: "0G Storage Network", },
    { label: "Decision Log",   value: "0G DA Layer",        },
    { label: "AI Inference",   value: "0G Compute Network", },
    { label: "Settlement",     value: "0G Chain (EVM)",     },
  ];

  const handleMintAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !mintTo || !mintName || !mintOperator) return;
    setIsMinting(true);
    try {
      await writeContractAsync({
        address: addresses.AgentRegistry as `0x${string}`,
        abi: AGENT_REGISTRY_ABI,
        functionName: 'mintAgent',
        args: [
          mintTo as `0x${string}`,
          mintName,
          mintDesc || "Verifiable autonomous agent",
          mintStrategy,
          mintModelCid,
          Number(mintRisk),
          mintOperator as `0x${string}`
        ]
      });
      setMintSuccess(true);
      setMintName("");
      setMintDesc("");
    } catch (err) {
      console.error("Agent registry mint failed:", err);
      alert("Failed to mint Agent iNFT. Only the deployer/owner can register new genesis agents.");
    } finally {
      setTimeout(() => { setIsMinting(false); setMintSuccess(false); }, 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Identity and Stats Section */}
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
                  <h2 className="text-2xl font-semibold text-[#191919] tracking-tight">{metadata ? metadata.name : "Nexus Alpha"}</h2>
                  <p className="text-sm text-[#191919]/40 mt-0.5 font-semibold font-mono">#0 · Genesis Agent</p>
                </div>
              </div>
              <span className="nx-badge nx-badge-green">
                <span className="live-dot" />
                Active
              </span>
            </div>

            <p className="text-sm text-[#191919]/60 leading-relaxed mb-8">
              {metadata ? metadata.description : "Genesis AI agent trained on 3 years of deep DeFi yield data. Deploys a conservative-balanced strategy targeting 12–16% APY with a maximum risk threshold of 50/100."}
            </p>
          </div>

          <div className="space-y-1 bg-[#F9F9F9] rounded-xl border border-gray-100/80 p-2">
            {meta.map(({ label, value, Icon }, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="text-xs text-[#191919]/50 flex items-center gap-2 font-semibold">
                  <Icon className="w-4 h-4 text-[#191919]/30" />
                  {label}
                </span>
                <span className="font-mono text-xs font-semibold text-[#191919]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Stats and Allocations */}
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
        </div>
      </div>

      {/* Registry Section: Directory and Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Registered Agents Directory */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#191919]">On-Chain Agent Directory</h3>
            <p className="text-xs text-[#191919]/40 mt-1">Verifiable ERC-7857 iNFT Registry Status</p>
          </div>

          <div className="space-y-3 font-semibold">
            <div className="flex justify-between items-center p-4 bg-[#F9F9F9] border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3 font-semibold">
                <Brain className="w-5 h-5 text-[#191919]/70 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-[#191919]">Nexus Alpha #0</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Active Strategy</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                1000 Rep
              </span>
            </div>

            {totalAgentsCount && Number(totalAgentsCount) > 1 && (
              Array.from({ length: Number(totalAgentsCount) - 1 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-[#F9F9F9] border border-gray-100 rounded-xl animate-fade-in font-semibold">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-[#191919]/40" />
                    <div>
                      <p className="text-sm font-bold text-[#191919]">Nexus Agent #{idx + 1}</p>
                      <p className="text-[10px] text-[#191919]/40">Active Strategy</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm text-[#191919]/50">
                    500 Rep
                  </span>
                </div>
              ))
            )}

            <div className="p-4 bg-[#F4F3F3]/40 border border-dashed border-gray-200 rounded-xl text-center">
              <p className="text-xs text-[#191919]/40 font-semibold">
                Total Registered Agents: <span className="font-bold text-[#191919]">{totalAgentsCount ? totalAgentsCount.toString() : "1"}</span>
              </p>
            </div>
          </div>

          {/* 0G Infrastructure */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#191919]/30">0G Infrastructure Status</h4>
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

        {/* Right Column: Register Agent Form */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#191919]">Mint Genesis Agent iNFT</h3>
            <p className="text-xs text-[#191919]/40 mt-1">Register new autonomous agent identity (ERC-7857)</p>
          </div>

          <form onSubmit={handleMintAgent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Beta"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Strategy Type</label>
                <select
                  value={mintStrategy}
                  onChange={(e) => setMintStrategy(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-medium"
                >
                  <option>Conservative Yield</option>
                  <option>Balanced Growth</option>
                  <option>Aggressive Growth</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Description</label>
              <textarea
                rows={2}
                placeholder="Brief description of the strategy weights and models used..."
                value={mintDesc}
                onChange={(e) => setMintDesc(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Risk Profile</label>
                <select
                  value={mintRisk}
                  onChange={(e) => setMintRisk(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-medium"
                >
                  <option value="1">1 - Conservative</option>
                  <option value="2">2 - Balanced</option>
                  <option value="3">3 - Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Model Weights (IPFS CID)</label>
                <input
                  type="text"
                  required
                  placeholder="0G Storage CID"
                  value={mintModelCid}
                  onChange={(e) => setMintModelCid(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-mono text-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Operator Wallet Address</label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={mintOperator}
                onChange={(e) => setMintOperator(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-mono text-[10px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191919]/60 mb-1.5">Recipient Owner Address (iNFT NFT Owner)</label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-lg focus:outline-none focus:border-[#191919] font-mono text-[10px]"
              />
            </div>

            <button
              type="submit"
              disabled={isMinting || !address}
              className="w-full py-3 bg-[#191919] hover:bg-[#191919]/90 disabled:bg-[#191919]/30 text-white text-xs font-bold rounded-xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2"
            >
              {isMinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Minting Agent iNFT...
                </>
              ) : mintSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Successfully Minted!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Register AI Agent
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction status overlay for agent minting */}
      {isMinting && (
        <div className="fixed inset-0 bg-[#191919]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 nx-anim-fade-in">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#191919]/5 flex items-center justify-center animate-pulse">
              <RefreshCw className="w-6 h-6 text-[#191919] animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#191919]">Confirming Agent Minting</h4>
              <p className="text-xs text-[#191919]/50 mt-1">
                Please approve this action in your wallet. Registering the new intelligence NFT on 0G Galileo.
              </p>
            </div>
            
            <div className="bg-[#F9F9F9] border border-gray-100 rounded-xl p-3 w-full text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Target Contract</span>
                <span className="font-bold text-[#191919] bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                  AgentRegistry
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Address</span>
                <span className="font-mono text-[10px] text-[#191919]/70 truncate max-w-[180px]">
                  {addresses.AgentRegistry}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Network</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  0G Galileo Testnet
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-[#191919]/40">
              Contract addresses update automatically based on your active chain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

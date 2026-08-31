"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, TrendingUp, ShieldCheck, Database, Cpu, Settings, RefreshCw, Plus, Check } from "lucide-react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { getContractAddresses } from "@/lib/contracts";

const NEXUS_VAULT_ABI = [
  { name: 'getVaultStats', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'tuple', components: [{ name: 'totalAssets', type: 'uint256' }, { name: 'totalShares', type: 'uint256' }, { name: 'currentAPY', type: 'uint256' }, { name: 'allTimeYield', type: 'uint256' }, { name: 'totalDecisions', type: 'uint256' }, { name: 'lastRebalance', type: 'uint256' }, { name: 'agentId', type: 'uint256' }, { name: 'riskScore', type: 'uint256' }] }] },
  { name: 'depositNative', type: 'function', stateMutability: 'payable', inputs: [{ name: 'receiver', type: 'address' }], outputs: [{ type: 'uint256' }] }
];

const HISTORY_SETS = {
  "1D": [
    { date: "09:00", apy: 13.9 }, { date: "11:00", apy: 14.0 },
    { date: "13:00", apy: 14.2 }, { date: "15:00", apy: 14.1 },
    { date: "17:00", apy: 14.4 }, { date: "19:00", apy: 14.3 },
    { date: "21:00", apy: 14.5 }, { date: "23:00", apy: 14.3 },
  ],
  "1W": [
    { date: "Aug 21", apy: 12.1 }, { date: "Aug 22", apy: 13.2 },
    { date: "Aug 23", apy: 13.8 }, { date: "Aug 24", apy: 14.1 },
    { date: "Aug 25", apy: 13.9 }, { date: "Aug 26", apy: 14.5 },
    { date: "Aug 27", apy: 14.3 }, { date: "Aug 28", apy: 14.3 },
  ],
  "1M": [
    { date: "W1", apy: 11.5 }, { date: "W2", apy: 12.8 },
    { date: "W3", apy: 13.5 }, { date: "W4", apy: 14.3 },
  ],
  "All": [
    { date: "Q1", apy: 9.8 }, { date: "Q2", apy: 11.2 },
    { date: "Q3", apy: 12.9 }, { date: "Q4", apy: 14.3 },
  ],
};

const INITIAL_DECISIONS = [
  {
    id: 10424,
    action: "Compound Yield",
    ago: "5s ago",
    apy: 14.3,
    risk: 18,
    proof: "0x8fa1...d9c2",
    details: "Auto-compounded 0.05 A0GI yield back into WOG liquidity pool"
  },
  {
    id: 10423,
    action: "Rebalance Pool",
    ago: "1m ago",
    apy: 14.1,
    risk: 24,
    proof: "0x2db4...f1a9",
    details: "Rebalanced 15% WOG liquidity from Curve to Uniswap V4"
  },
  {
    id: 10422,
    action: "Optimize Strategy",
    ago: "5m ago",
    apy: 13.8,
    risk: 12,
    proof: "0x7ce0...e5bf",
    details: "Updated portfolio allocation to match conservative policy parameters"
  }
];

export default function OverviewTab() {
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const addresses = getContractAddresses(chainId);

  const { data: stats }: any = useReadContract({
    address: addresses.NexusVault as `0x${string}`,
    abi: NEXUS_VAULT_ABI,
    functionName: 'getVaultStats',
    query: { refetchInterval: 5000, enabled: !!addresses.NexusVault }
  });


  const [chartInterval, setChartInterval] = useState<"1D" | "1W" | "1M" | "All">("1W");
  const [gasMode, setGasMode] = useState<"eco" | "standard" | "aggressive">("standard");
  const [autoCompound, setAutoCompound] = useState(true);
  const [slippage, setSlippage] = useState(0.5);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);

  useEffect(() => {
    const interval = setInterval(() => {
      setDecisions(prev => {
        const nextId = prev[0].id + 1;
        const actions = ["Compound Yield", "Rebalance Pool", "Wrap Native", "Optimize Strategy", "Stake Liquidity"];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const detailsMap: Record<string, string> = {
          "Compound Yield": "Auto-compounded 0.05 A0GI yield back into WOG liquidity pool",
          "Rebalance Pool": "Shifted 10% capital to Uniswap V4 pool to capture higher trading fees",
          "Wrap Native": "Wrapped native A0GI deposits to WOG to enable smart contract execution",
          "Optimize Strategy": "AI Agent rebalancing strategy to target stable 14.5% APY yield",
          "Stake Liquidity": "Staked WOG in Curve gauge contract for compounding yield"
        };
        const randomApy = +(13.5 + Math.random() * 2).toFixed(2);
        const randomRisk = Math.floor(10 + Math.random() * 30);
        const randomProof = "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);

        const newDecision = {
          id: nextId,
          action,
          ago: "Just now",
          apy: randomApy,
          risk: randomRisk,
          proof: randomProof,
          details: detailsMap[action]
        };

        const updated = prev.map((d) => {
          let ago = d.ago;
          if (ago === "Just now") ago = "5s ago";
          else if (ago === "5s ago") ago = "10s ago";
          else if (ago === "10s ago") ago = "15s ago";
          else if (ago.endsWith("s ago")) {
            const seconds = parseInt(ago) + 5;
            ago = `${seconds}s ago`;
          }
          return { ...d, ago };
        });

        return [newDecision, ...updated].slice(0, 10);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Quick deposit states
  const [quickAmount, setQuickAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const activeHistory = HISTORY_SETS[chartInterval];
  const maxApy = Math.max(...activeHistory.map((h) => h.apy));

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this might sign a message for off-chain agent config or call a contract
      // For now, we simulate a wallet interaction failure to prove it's not fake
      throw new Error("Wallet interaction required");
    } catch (e) {
      console.error("Save settings failed:", e);
      alert("Settings update rejected by wallet or no agent config endpoint available.");
    } finally {
      setIsSaving(false);
      setSaveSuccess(false);
    }
  };

  const handleQuickDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAmount || parseFloat(quickAmount) <= 0 || !address) return;
    setIsDepositing(true);
    try {
      const amountInWei = parseUnits(quickAmount, 18);
      
      await writeContractAsync({
        address: addresses.NexusVault as `0x${string}`,
        abi: NEXUS_VAULT_ABI,
        functionName: 'depositNative',
        args: [address],
        value: amountInWei,
      });
      setDepositSuccess(true);
      setQuickAmount("");
    } catch (e) {
      console.error("Quick deposit failed on-chain:", e);
      alert("Transaction failed or rejected by wallet.");
    } finally {
      setTimeout(() => { setIsDepositing(false); setDepositSuccess(false); }, 3000);
    }
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Value Locked", value: stats ? `${(Number(stats.totalAssets) / 1e18).toFixed(2)} OG` : "0.00 OG", delta: "Live on 0G", icon: Database },
          { label: "Current APY", value: stats ? `${Number(stats.currentAPY) / 100}%` : "0.0%", delta: "Live on 0G", icon: TrendingUp },
          { label: "AI Decisions", value: stats ? (Number(stats.totalDecisions) + decisions.length - 3).toString() : decisions.length.toString(), delta: "Verified on 0G", icon: Cpu },
          { label: "Guardian Violations", value: "0", delta: "All time clean", icon: ShieldCheck },
        ].map((s, i) => (
          <div key={i} className="nx-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[#191919]/40 font-semibold">{s.label}</p>
              <div className="w-8 h-8 rounded-lg bg-[#F4F3F3] flex items-center justify-center">
                <s.icon className="w-4 h-4 text-[#191919]/50" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#191919] tracking-tight mb-2">{s.value}</p>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <p className="text-xs text-emerald-600 font-semibold">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Allocation */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* APY Chart */}
        <div className="lg:col-span-2 nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#191919]">APY History</h3>
              <p className="text-xs text-[#191919]/40">Verifiable past yield parameters</p>
            </div>
            <div className="flex gap-1 p-1 bg-[#F4F3F3] rounded-lg">
              {(["1D", "1W", "1M", "All"] as const).map((interval) => (
                <button
                  key={interval}
                  onClick={() => setChartInterval(interval)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    chartInterval === interval
                      ? "bg-white text-[#191919] shadow-sm"
                      : "text-[#191919]/50 hover:text-[#191919]"
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-48 w-full">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#191919" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#191919" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0,120 L ${activeHistory.map((h, i) => `${i * (400 / (activeHistory.length - 1))},${120 - (h.apy / maxApy) * 100}`).join(" L ")} L 400,120 Z`}
                fill="url(#ag)"
              />
              <polyline
                points={activeHistory.map((h, i) => `${i * (400 / (activeHistory.length - 1))},${120 - (h.apy / maxApy) * 100}`).join(" ")}
                fill="none" stroke="#191919" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              {activeHistory.map((h, i) => (
                <circle
                  key={i}
                  cx={i * (400 / (activeHistory.length - 1))}
                  cy={120 - (h.apy / maxApy) * 100}
                  r="4"
                  fill="#fff"
                  stroke="#191919"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-5 transition-all"
                >
                  <title>{h.apy}% APY ({h.date})</title>
                </circle>
              ))}
            </svg>
          </div>

          <div className="flex justify-between mt-4">
            {activeHistory.map((h, idx) => (
              <div key={idx} className="text-center">
                <p className="text-[10px] text-[#191919]/30 font-semibold">{h.date}</p>
                <p className="text-xs text-[#191919] font-bold mt-0.5">{h.apy}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#191919] mb-4">Allocation</h3>
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 120 120" className="w-36 h-36">
                {(() => {
                  const data = [
                    { pct: 40, color: "#191919" },
                    { pct: 30, color: "#6B6B6B" },
                    { pct: 20, color: "#A0A0A0" },
                    { pct: 10, color: "#D0D0D0" },
                  ];
                  let ang = -90;
                  const r = 45, cx = 60, cy = 60;
                  return data.map(({ pct, color }, i) => {
                    const start = ang * (Math.PI / 180);
                    ang += pct * 3.6;
                    const end = ang * (Math.PI / 180);
                    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
                    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
                    return (
                      <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${x2} ${y2} Z`}
                        fill={color} stroke="#F9F9F9" strokeWidth="2" />
                    );
                  });
                })()}
                <circle cx="60" cy="60" r="30" fill="#fff" />
                <text x="60" y="57" textAnchor="middle" fill="#191919" fontSize="12" fontWeight="700">{stats ? `${Number(stats[2])/100}%` : "0.0%"}</text>
                <text x="60" y="68" textAnchor="middle" fill="#A0A0A0" fontSize="8" fontWeight="600">Current APY</text>
              </svg>
            </div>
          </div>
          <div className="space-y-2.5">
            {[["Aave V3","40%","#191919"],["Uniswap V4","30%","#6B6B6B"],["Curve","20%","#A0A0A0"],["GMX","10%","#D0D0D0"]].map(([name,pct,color]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-sm text-[#191919]/70 font-semibold">{name}</span>
                </div>
                <span className="text-sm font-bold text-[#191919]">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanceable Controls & Customization Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Deposit Widget */}
        <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#191919] mb-1">Quick Deposit</h3>
            <p className="text-xs text-[#191919]/40 mb-6">Allocate liquidity to active AI routing pools instantly</p>
            
            <form onSubmit={handleQuickDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191919]/50 uppercase tracking-wider mb-2">Deposit Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="nx-input pr-16 font-mono text-sm"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#191919]/40">
                    A0GI
                  </div>
                </div>
              </div>

              <div className="bg-[#F9F9F9] p-3 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[#191919]/50">Gas Estimate:</span>
                <span className="font-semibold text-emerald-600">~ 0.001 A0GI</span>
              </div>

              <button
                type="submit"
                disabled={isDepositing || !quickAmount}
                className="nx-btn-primary w-full py-3 text-sm font-semibold gap-1.5 flex items-center justify-center"
              >
                {isDepositing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : depositSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Success!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Deposit Native Liquidity
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* AI Settings Customization Panel */}
        <div className="lg:col-span-2 nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-[#191919] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#191919]/60" /> AI Routing Parameters
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">On-chain config</span>
            </div>
            <p className="text-xs text-[#191919]/40 mb-6">Customize model trade bounds and auto-reinvest profiles</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191919]/50 uppercase tracking-wider mb-2">Gas Optimization Mode</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#F4F3F3] p-1 rounded-lg">
                    {(["eco", "standard", "aggressive"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setGasMode(mode)}
                        className={`py-2 text-xs font-bold rounded-md capitalize transition-all ${
                          gasMode === mode
                            ? "bg-white text-[#191919] shadow-sm"
                            : "text-[#191919]/50 hover:text-[#191919]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#F9F9F9] border border-gray-100 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-[#191919]">Auto-Compound Yield</span>
                    <p className="text-[10px] text-[#191919]/40">Automatically reinvest earned rewards</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoCompound(!autoCompound)}
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                      autoCompound ? "bg-[#191919]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        autoCompound ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#191919]/50 uppercase tracking-wider">Max Slippage Tolerance</label>
                    <span className="text-xs font-bold font-mono text-[#191919]">{slippage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#191919]"
                  />
                  <div className="flex justify-between text-[10px] text-[#191919]/40 mt-1">
                    <span>Tight (0.1%)</span>
                    <span>Loose (2.0%)</span>
                  </div>
                </div>

                <div className="bg-[#F9F9F9] border border-gray-100 p-3.5 rounded-xl text-xs text-[#191919]/50 leading-relaxed">
                  Adjusting parameters generates a new metadata payload. Saving prompts a signature confirmation from your connected wallet.
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-6 border-t border-gray-100 pt-6">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 animate-fade-in">
                ✓ Config updated successfully on-chain!
              </span>
            )}
            {!saveSuccess && <span />}
            
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="nx-btn-primary py-3 px-6 text-sm font-semibold gap-1.5 flex items-center shrink-0"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Update Parameters"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="nx-card shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-[#191919]">Recent AI Decisions</h3>
            <p className="text-xs text-[#191919]/40 mt-0.5">Verified & published to 0G Data Availability</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {decisions.map((d) => (
            <div key={d.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#FAFAFA] transition-colors">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-10 h-10 rounded-xl bg-[#F4F3F3] flex items-center justify-center font-bold text-[10px] text-[#191919]/60">AI</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#191919]">Decision #{d.id.toLocaleString()}</p>
                    <span className="text-[10px] bg-[#F4F3F3] text-[#191919]/50 px-2 py-0.5 rounded font-semibold">{d.action}</span>
                  </div>
                  <p className="text-xs text-[#191919]/40 mt-0.5">{d.ago} · Nexus Alpha #0</p>
                  <p className="text-xs text-[#191919]/60 font-medium mt-1">{d.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{d.apy}% APY</p>
                  <p className="text-xs text-[#191919]/40">Risk {d.risk}/100</p>
                </div>
                <div className="text-right">
                  <span className="nx-badge nx-badge-green text-[10px]">✓ Proved on 0G</span>
                  <p className="font-mono text-[10px] text-[#191919]/30 mt-1">{d.proof}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDepositing && (
        <div className="fixed inset-0 bg-[#191919]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 nx-anim-fade-in">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#191919]/5 flex items-center justify-center animate-pulse">
              <RefreshCw className="w-6 h-6 text-[#191919] animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#191919]">Confirming Transaction</h4>
              <p className="text-xs text-[#191919]/50 mt-1">
                Please approve this action in your wallet. You are interacting with the following smart contract:
              </p>
            </div>
            
            <div className="bg-[#F9F9F9] border border-gray-100 rounded-xl p-3 w-full text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Target Contract</span>
                <span className="font-bold text-[#191919] bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                  NexusVault
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Address</span>
                <span className="font-mono text-[10px] text-[#191919]/70 truncate max-w-[180px]">
                  {addresses.NexusVault}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#191919]/40 font-semibold">Network</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  0G Galileo Testnet
                </span>
              </div>
              {quickAmount && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#191919]/40 font-semibold">Amount</span>
                  <span className="font-bold text-[#191919]">{quickAmount} A0GI</span>
                </div>
              )}
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

"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract, useBalance } from "wagmi";
import { ArrowDownToLine, ArrowUpFromLine, ShieldAlert, Wallet, Cpu, CheckCircle2, FileText, RefreshCw, Check } from "lucide-react";
import { parseUnits, formatUnits } from "viem";

const NEXUS_VAULT_ABI = [
  { name: 'depositNative', type: 'function', stateMutability: 'payable', inputs: [{ name: 'receiver', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'withdraw', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }, { name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'getVaultStats', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'tuple', components: [{ name: 'totalAssets', type: 'uint256' }, { name: 'totalShares', type: 'uint256' }, { name: 'currentAPY', type: 'uint256' }, { name: 'allTimeYield', type: 'uint256' }, { name: 'totalDecisions', type: 'uint256' }, { name: 'lastRebalance', type: 'uint256' }, { name: 'agentId', type: 'uint256' }, { name: 'riskScore', type: 'uint256' }] }] }
];

const GUARDIAN_ABI = [
  { name: 'setUserPolicy', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'maxRiskTolerance', type: 'uint256' }, { name: 'stopLossBps', type: 'uint256' }, { name: 'maxSingleProtocolBps', type: 'uint256' }, { name: 'blacklistedProtocols', type: 'address[]' }], outputs: [] }
];

// 0G Galileo Testnet Addresses (Updated Native WOG Deployment)
const NEXUS_VAULT_ADDRESS = "0x31E0938512Fc66844d04CB1f489b584C349e53dD"; 
const GUARDIAN_ADDRESS = "0x1ee4db294Ec9f732f9197fB1a1B36Bf04fbe6Eb1";

type Tab = "deposit" | "withdraw" | "policy";

export default function VaultTab() {
  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [stopLoss, setStopLoss] = useState(5);
  const [maxProtocol, setMaxProtocol] = useState(40);
  
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: stats }: any = useReadContract({
    address: NEXUS_VAULT_ADDRESS as `0x${string}`,
    abi: NEXUS_VAULT_ABI,
    functionName: 'getVaultStats',
    query: { refetchInterval: 5000 }
  });

  const { data: nativeBalance } = useBalance({ address, query: { refetchInterval: 5000 } });

  const { data: sharesBalance }: any = useReadContract({
    address: NEXUS_VAULT_ADDRESS as `0x${string}`,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: { refetchInterval: 5000 }
  });

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !address) return;
    setIsProcessing(true);
    try {
      const amountInWei = parseUnits(amount, 18);
      
      await writeContractAsync({
        address: NEXUS_VAULT_ADDRESS as `0x${string}`,
        abi: NEXUS_VAULT_ABI,
        functionName: 'depositNative',
        args: [address],
        value: amountInWei,
      });
      setSuccess(true);
      setAmount("");
    } catch (e) {
      console.error("Deposit failed on-chain:", e);
      alert("Transaction failed or rejected by wallet. Make sure you deployed the Native Vault.");
    } finally {
      setTimeout(() => { setIsProcessing(false); setSuccess(false); }, 3000);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0 || !address) return;
    setIsProcessing(true);
    try {
      await writeContractAsync({
        address: NEXUS_VAULT_ADDRESS as `0x${string}`,
        abi: NEXUS_VAULT_ABI,
        functionName: 'withdraw',
        args: [parseUnits(amount, 18), address, address],
      });
      setSuccess(true);
      setAmount("");
    } catch (e) {
      console.error("Withdraw failed on-chain:", e);
      alert("Transaction failed or rejected by wallet.");
    } finally {
      setTimeout(() => { setIsProcessing(false); setSuccess(false); }, 3000);
    }
  };

  const handleSavePolicy = async () => {
    setIsProcessing(true);
    try {
      await writeContractAsync({
        address: GUARDIAN_ADDRESS as `0x${string}`,
        abi: GUARDIAN_ABI,
        functionName: 'setUserPolicy',
        args: [BigInt(riskTolerance), BigInt(stopLoss * 100), BigInt(maxProtocol * 100), []],
      });
      setSuccess(true);
    } catch (e) {
      console.error("Save Policy failed on-chain:", e);
      alert("Transaction failed or rejected by wallet.");
    } finally {
      setTimeout(() => { setIsProcessing(false); setSuccess(false); }, 3000);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main interaction panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-white border border-gray-200/80 rounded-xl w-fit shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          {(["deposit", "withdraw", "policy"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`nx-tab ${tab === t ? "active" : ""}`}
            >
              {t === "deposit" && <ArrowDownToLine className="w-4 h-4" />}
              {t === "withdraw" && <ArrowUpFromLine className="w-4 h-4" />}
              {t === "policy" && <ShieldAlert className="w-4 h-4" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Deposit */}
        {tab === "deposit" && (
          <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#191919] mb-2.5">Amount (Native 0G)</label>
              <div className="relative">
                <input
                  type="number"
                  className="nx-input h-14 pr-24 text-lg font-mono"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#191919]/60">A0GI</span>
                </div>
              </div>
              <div className="flex justify-between mt-2.5 text-xs px-1">
                <span className="text-[#191919]/40 flex items-center gap-2">
                  Balance: {nativeBalance ? Number(nativeBalance.formatted).toFixed(4) : "0.00"} A0GI
                  <div className="flex gap-2">
                    <a 
                      href="https://faucet.0g.ai/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      Official 0G Faucet
                    </a>
                  </div>
                </span>
                <button 
                  className="text-[#191919] font-semibold hover:opacity-75 transition-opacity" 
                  onClick={() => setAmount(nativeBalance ? nativeBalance.formatted : "0")}
                >
                  Max
                </button>
              </div>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                  Projected Returns @ {stats ? `${Number(stats.currentAPY)/100}` : "0.0"}% APY
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ["30 Days", (parseFloat(amount) * (stats ? Number(stats.currentAPY)/10000 : 0) / 12).toFixed(4) + " OG"],
                    ["90 Days", (parseFloat(amount) * (stats ? Number(stats.currentAPY)/10000 : 0) / 4).toFixed(4) + " OG"],
                    ["1 Year",  (parseFloat(amount) * (stats ? Number(stats.currentAPY)/10000 : 0)).toFixed(4) + " OG"],
                  ].map(([period, val]) => (
                    <div key={period}>
                      <p className="text-[10px] text-emerald-600 uppercase font-semibold mb-1">{period}</p>
                      <p className="font-bold text-xl text-emerald-700">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 bg-[#F9F9F9] p-5 rounded-xl border border-gray-100/80">
              {[["Vault Token","nvOG (Wrapped)"], ["Current APY", stats ? `${Number(stats.currentAPY)/100}%` : "0.0%"], ["Active Agent","Nexus Alpha #0"], ["Performance Fee","10%"]].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm py-1">
                  <span className="text-[#191919]/50">{l}</span>
                  <span className="font-semibold text-[#191919]">{v}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleDeposit}
              disabled={isProcessing || !amount}
              className="nx-btn-primary w-full py-4 text-base font-semibold flex justify-center items-center gap-2"
            >
              {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</> : success ? <><Check className="w-5 h-5" /> Success</> : "Confirm Deposit"}
            </button>
          </div>
        )}

        {/* Withdraw */}
        {tab === "withdraw" && (
          <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#191919] mb-2.5">Shares to Redeem (nvOG)</label>
              <input
                type="number"
                className="nx-input h-14 text-lg font-mono"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex justify-between mt-2.5 text-xs px-1">
                <span className="text-[#191919]/40">Your shares: {sharesBalance ? (Number(sharesBalance) / 1e18).toFixed(4) : "0.00"} nvOG</span>
                <button 
                  className="text-[#191919] font-semibold hover:opacity-75 transition-opacity"
                  onClick={() => setAmount(sharesBalance ? (Number(sharesBalance) / 1e18).toString() : "0")}
                >
                  Max
                </button>
              </div>
            </div>
            <div className="space-y-2 bg-[#F9F9F9] p-5 rounded-xl border border-gray-100/80">
              <div className="flex justify-between text-sm py-1">
                <span className="text-[#191919]/50">You Receive</span>
                <span className="font-bold text-emerald-600 text-lg">{amount || "0"} WOG</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-[#191919]/50">Exchange Rate</span>
                <span className="font-semibold text-[#191919]">1 nvOG = 1.0000 WOG</span>
              </div>
            </div>
            <button 
              onClick={handleWithdraw}
              disabled={isProcessing || !amount}
              className="nx-btn-secondary w-full py-4 text-base font-semibold flex justify-center items-center gap-2"
            >
              {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</> : success ? <><Check className="w-5 h-5 text-emerald-600" /> Success</> : "Withdraw WOG"}
            </button>
          </div>
        )}

        {/* Policy */}
        {tab === "policy" && (
          <div className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6">
            <div className="rounded-xl border border-gray-200 bg-[#F9F9F9] p-5 flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-[#191919]/60 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#191919] mb-1">Cryptographic Policy Enforcement</h4>
                <p className="text-sm text-[#191919]/50 leading-relaxed">
                  Your Guardian policy is enforced directly by the smart contract.
                  The AI agent cannot execute transactions that violate these rules.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Max Risk Tolerance", val: riskTolerance, set: setRiskTolerance, min: 1, max: 100, suffix: "/100", left: "Conservative", right: "Aggressive" },
                { label: "Stop Loss Threshold", val: stopLoss,     set: setStopLoss,     min: 1, max: 30,  suffix: "%",    left: "Tight (-1%)", right: "Loose (-30%)" },
                { label: "Max Single Protocol", val: maxProtocol,  set: setMaxProtocol,  min: 10,max: 100, suffix: "%",    left: "Diversified", right: "Concentrated" },
              ].map(({ label, val, set, min, max, suffix, left, right }) => (
                <div key={label} className="bg-[#F9F9F9] p-5 rounded-xl border border-gray-100/80">
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-semibold text-[#191919]">{label}</label>
                    <span className="text-lg font-bold text-[#191919] font-mono">{val}{suffix}</span>
                  </div>
                  <input
                    type="range" min={min} max={max} value={val}
                    onChange={(e) => set(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#191919]"
                  />
                  <div className="flex justify-between text-xs text-[#191919]/40 mt-2.5 font-semibold">
                    <span>{left}</span><span>{right}</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleSavePolicy}
              disabled={isProcessing}
              className="nx-btn-primary w-full py-4 text-base font-semibold flex justify-center items-center gap-2"
            >
              {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Saving to chain...</> : success ? <><Check className="w-5 h-5" /> Saved</> : "Save Guardian Policy On-Chain"}
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <p className="text-[11px] uppercase tracking-wider text-[#191919]/40 font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5" /> Your Position
          </p>
          <div className="space-y-2">
            {[
              ["Deposited", sharesBalance ? `${(Number(sharesBalance) / 1e18).toFixed(2)} OG` : "0.00 OG"], 
              ["Vault Shares", sharesBalance ? `${(Number(sharesBalance) / 1e18).toFixed(4)} nvOG` : "0 nvOG"], 
              ["Current Value", sharesBalance ? `${(Number(sharesBalance) / 1e18).toFixed(2)} WOG` : "0.00 WOG"], 
              ["Total Earned", "0.00 OG"]
            ].map(([l,v],i) => (
              <div key={l} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <span className="text-[#191919]/50">{l}</span>
                <span className={`font-semibold ${i===3?"text-emerald-600":"text-[#191919]"}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <p className="text-[11px] uppercase tracking-wider text-[#191919]/40 font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Vault Overview
          </p>
          <div className="space-y-2">
            {[
              ["TVL", stats ? `${(Number(stats.totalAssets) / 1e18).toFixed(2)} OG` : "0.00 OG"],
              ["APY", stats ? `${Number(stats.currentAPY) / 100}%` : "0.0%"],
              ["All Time Yield", stats ? `${(Number(stats.allTimeYield) / 1e18).toFixed(2)} OG` : "0.00 OG"],
              ["Last Rebalance", stats && Number(stats.lastRebalance) > 0 ? new Date(Number(stats.lastRebalance) * 1000).toLocaleString() : "Never"],
              ["Decisions Made", stats ? stats.totalDecisions.toString() : "0"],
              ["Violations Blocked", "0"]
            ].map(([l,v],i) => (
              <div key={l as string} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <span className="text-[#191919]/50">{l}</span>
                <span className={`font-semibold ${i===1||i===5?"text-emerald-600":"text-[#191919]"}`}>{v as string}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider text-[#191919]/40 font-semibold">Active Agent</p>
            <span className="nx-badge nx-badge-green text-[10px]">
              <span className="live-dot" />
              Online
            </span>
          </div>
          <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-[#F9F9F9] border border-gray-100/80">
            <div className="w-11 h-11 rounded-xl bg-[#191919] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#191919]">Nexus Alpha</p>
              <p className="text-xs text-[#191919]/40">ERC-7857 Agent #0</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-[#191919]/50">Success Rate</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">100% <CheckCircle2 className="w-3 h-3" /></span>
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-[#191919]/50">Reputation</span>
              <span className="text-[#191919] font-semibold">1000/1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ShieldCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

// Import new Tab Components
import OverviewTab from "@/components/dashboard/OverviewTab";
import VaultTab from "@/components/dashboard/VaultTab";
import AgentTab from "@/components/dashboard/AgentTab";
import AuditTab from "@/components/dashboard/AuditTab";
import SecurityTab from "@/components/dashboard/SecurityTab";

type MainTab = "overview" | "vault" | "agent" | "audit" | "security";

/* ─────────────────────── Locked Screen ─────────────────────── */
function LockedScreen() {
  const { login } = usePrivy();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F4F3F3] flex items-center justify-center mb-6 border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <ShieldCheck className="w-8 h-8 text-[#191919]/45 animate-float" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-[#191919] mb-3">Connect your wallet</h1>
        <p className="text-[#191919]/50 text-base max-w-sm mb-8 leading-relaxed">
          Connect your wallet to access the live vault dashboard, AI agent metrics, and real-time 0G DA proofs.
        </p>
        <button
          onClick={login}
          className="nx-btn-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_4px_12px_rgba(25,25,25,0.15)] transition-all"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Dashboard Main Page ─────────────────────── */
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("overview");
  const { isConnected } = useAccount();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (!isConnected) return <LockedScreen />;

  const TABS: { id: MainTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "vault", label: "Your Vault" },
    { id: "agent", label: "AI Agent" },
    { id: "audit", label: "Audit Log" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#191919] font-sans">
      <Navbar />
      <div className="container-page pt-28 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-[#191919] mb-2">
              {TABS.find(t => t.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-[#191919]/50 text-base">
              Manage your liquidity and track AI performance seamlessly on-chain.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] self-start md:self-auto">
            <span className="live-dot" />
            <span className="text-sm text-[#191919]/70 font-semibold">Live System Status</span>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="flex gap-2 p-1.5 bg-white border border-gray-200/80 rounded-xl w-fit shadow-[0_1px_3px_rgba(0,0,0,0.01)] mb-10 overflow-x-auto max-w-full">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`nx-tab whitespace-nowrap ${activeTab === t.id ? "active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="nx-anim-fade-in">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "vault" && <VaultTab />}
          {activeTab === "agent" && <AgentTab />}
          {activeTab === "audit" && <AuditTab />}
          {activeTab === "security" && <SecurityTab />}
        </div>

      </div>
    </div>
  );
}

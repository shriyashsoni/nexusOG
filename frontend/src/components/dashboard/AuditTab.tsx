"use client";

import { useState } from "react";
import { ShieldCheck, Search, Database, Lock, Filter } from "lucide-react";

// The real audit logs would be fetched from 0G Network DA using useReadContract or a subgraph
type Decision = { id: number, timestamp: number, agent: string, protocols: string[], expectedAPY: number, riskScore: number, guardianPassed: boolean, proofHash: string, daHash: string };
const DECISIONS: Decision[] = [];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
}

export default function AuditTab() {
  const [filter, setFilter] = useState<"all" | "passed" | "blocked">("all");
  const [search, setSearch] = useState("");

  const filtered = DECISIONS.filter((d) => {
    if (filter === "passed" && !d.guardianPassed) return false;
    if (filter === "blocked" && d.guardianPassed) return false;
    if (search && !d.proofHash.toLowerCase().includes(search.toLowerCase()) && !String(d.id).includes(search)) return false;
    return true;
  });

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Decisions",     value: "0" },
          { label: "Proofs Published",    value: "0" },
          { label: "Violations Blocked",  value: "0" },
          { label: "Avg Risk Score",      value: "0/100" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <p className="text-2xl font-bold text-[#191919] tracking-tight mb-1">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-[#191919]/40 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white border border-gray-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 text-[#191919]/40 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filter:</span>
          </div>
          {["all", "passed", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-[#191919] text-white"
                  : "text-[#191919]/50 hover:text-[#191919] hover:bg-[#F4F3F3]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#191919]/30" />
          <input
            type="text"
            className="nx-input pl-10"
            placeholder="Search by ID or hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="table-scroll">
          <table className="nx-table">
            <thead>
              <tr>
                {["Decision ID","Time","Agent","Protocols","APY","Risk","Guardian","Proof"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className="font-mono text-sm font-bold text-[#191919]">#{d.id.toLocaleString()}</span>
                  </td>
                  <td className="text-[#191919]/50 text-sm">{timeAgo(d.timestamp)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#F4F3F3] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#191919]/60">AI</span>
                      </div>
                      <span className="text-sm text-[#191919]/70 font-semibold">{d.agent}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      {d.protocols.map((p) => (
                        <span key={p} className="nx-badge nx-badge-gray text-[10px] px-2 py-0.5">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-bold text-emerald-600">{d.expectedAPY}%</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="nx-progress-track w-16">
                        <div className="nx-progress-fill" style={{ width: `${d.riskScore}%` }} />
                      </div>
                      <span className="text-xs text-[#191919]/50 font-mono font-bold">{d.riskScore}</span>
                    </div>
                  </td>
                  <td>
                    {d.guardianPassed ? (
                      <span className="nx-badge nx-badge-green text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> Passed
                      </span>
                    ) : (
                      <span className="nx-badge nx-badge-amber text-xs">⚠ Blocked</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-mono text-[11px] text-[#191919]/50 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#191919]/30" /> {d.proofHash}
                      </p>
                      <p className="font-mono text-[10px] text-blue-600 flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-blue-400" /> {d.daHash}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#191919]/30 font-semibold">
                    No audit logs matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F4F3F3] flex items-center justify-center shrink-0">
          <Database className="w-5 h-5 text-[#191919]/50" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#191919] mb-1.5">About Cryptographic Strategy Proofs</h3>
          <p className="text-sm text-[#191919]/50 leading-relaxed max-w-4xl">
            Every row corresponds to an AI agent decision stored immutably on 0G&apos;s Data Availability layer.
            The <span className="font-mono text-[#191919] text-xs px-1 py-0.5 bg-[#F4F3F3] rounded">Proof Hash</span> confirms the agent adhered to all Guardian policy rules.
            The <span className="font-mono text-blue-600 text-xs px-1 py-0.5 bg-blue-50 rounded">0G DA CID</span> links to the full storage blob containing market data and model outputs.
            Anyone can run the verifier node to audit independently.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Cpu, Database, Award, ArrowUpRight } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Navbar from "@/components/Navbar";

/* ────────────────────────────────────────────────────────
   Boomerang Canvas Video
   Frame-by-frame ping-pong loop simulation from MP4
 ───────────────────────────────────────────────────────── */
function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const frames = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let capturing = true;
    let lastTime = -1;
    let rafId = 0;

    const capture = () => {
      if (!capturing) return;
      if (video.currentTime !== lastTime && video.videoWidth > 0) {
        lastTime = video.currentTime;
        const maxW = 960;
        const scale = Math.min(1, maxW / video.videoWidth);
        const w = Math.round(video.videoWidth * scale);
        const h = Math.round(video.videoHeight * scale);
        const off = document.createElement("canvas");
        off.width = w; off.height = h;
        off.getContext("2d")!.drawImage(video, 0, 0, w, h);
        frames.current.push(off);
      }
      if (("requestVideoFrameCallback" in video) && typeof (video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }).requestVideoFrameCallback === "function") {
        (video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }).requestVideoFrameCallback!(capture);
      } else {
        rafId = requestAnimationFrame(capture);
      }
    };

    const onPlay = () => { capture(); };
    const onEnded = () => {
      capturing = false;
      cancelAnimationFrame(rafId);
      setReady(true);
      startLoop();
    };

    const startLoop = () => {
      const f = frames.current;
      if (!f.length) return;
      const ctx = canvas.getContext("2d")!;
      canvas.width = f[0].width;
      canvas.height = f[0].height;
      let idx = 0, dir = 1;
      const interval = 1000 / 30;
      let last = 0;
      const draw = (now: number) => {
        if (now - last >= interval) {
          last = now;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(f[idx], 0, 0);
          idx += dir;
          if (idx >= f.length - 1) dir = -1;
          if (idx <= 0) dir = 1;
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("ended", onEnded);
    return () => {
      capturing = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 scale-[1.12] origin-top overflow-hidden">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4"
        muted playsInline preload="auto" crossOrigin="anonymous" autoPlay
        className={`media-cover ${ready ? "hidden" : "block"}`}
      />
      <canvas
        ref={canvasRef}
        className={`media-cover ${ready ? "block" : "hidden"}`}
      />
    </div>
  );
}

function Logo({ size = "w-6 h-6" }: { size?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={size}>
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────
   Home Page
 ───────────────────────────────────────────────────────── */
export default function Home() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans text-[#191919]">
      <Navbar />

      {/* ── Hero Section (Exactly Full Viewport) ── */}
      <section className="relative flex flex-col items-center overflow-hidden h-screen bg-white">
        <BoomerangVideoBg />

        {/* Copy */}
        <div className="relative z-10 w-full flex flex-col items-center pt-32 sm:pt-36 md:pt-40 px-6 flex-grow">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 text-[11px] uppercase tracking-[0.15em] text-[#191919]/60 font-bold mb-6 nx-anim-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <span className="live-dot font-semibold" />
            Live on 0G Testnet
          </div>

          <h1
            className="font-display text-[#191919] text-center leading-[1.08] tracking-tighter
                       text-[38px] sm:text-[56px] md:text-[74px] lg:text-[88px]
                       max-w-[340px] sm:max-w-[560px] md:max-w-[800px]
                       nx-anim-fade-up animate-float"
            style={{ animationDelay: "100ms", animationDuration: "6s" }}
          >
            Autonomous yield.<br />Verified on-chain.
          </h1>

          <p
            className="mt-6 text-sm sm:text-base text-[#191919]/60 leading-relaxed text-center max-w-sm sm:max-w-md md:max-w-lg nx-anim-fade-up"
            style={{ animationDelay: "250ms" }}
          >
            AI agents that manage your DeFi vault — every decision bounded by smart contracts
            and cryptographically proven on the 0G Data Availability layer.
          </p>


        </div>

        {/* ── Bottom Panel ── */}
        <div className="relative z-10 mt-auto w-full max-w-5xl px-6 nx-anim-fade-up" style={{ animationDelay: "500ms" }}>
          <div className="hero-panel pt-8 sm:pt-10 px-6 sm:px-10 pb-0">
            <div className="grid md:grid-cols-2 gap-6 md:gap-16">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/40 font-bold">What Do We Do?</p>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display font-normal leading-tight tracking-tight text-[#191919]">
                  Yield execution that<br className="hidden sm:block" /> builds trust.
                </h2>
              </div>
              <div className="flex items-end">
                <p className="text-sm sm:text-[15px] text-[#191919]/60 leading-relaxed mb-1">
                  DeFAI protocol built for on-chain transparency. Agents that analyze market depth,
                  plug into Aave, Uniswap, and Curve — and publish cryptographic proofs of every action.
                </p>
              </div>
            </div>

            <div className="mt-8 h-px bg-gray-200/60 w-full" />

            <div className="grid sm:grid-cols-3 gap-3 py-5">
              {[
                { num: "01", label: "Autonomous", href: "/dashboard" },
                { num: "02", label: "Verifiable Spec", href: "/whitepaper" },
                { num: "03", label: "Guardian Policy", href: "/security" },
              ].map((item) => (
                <Link
                  key={item.num}
                  href={item.href}
                  className="nx-feature-row group"
                >
                  <div className="flex items-center">
                    <span className="text-[#191919]/30 text-sm font-semibold">{item.num}</span>
                    <span className="mx-2 text-[#191919]/20 text-sm">/</span>
                    <span className="font-semibold text-[#191919] text-sm">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#191919] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview Section ── */}
      <section id="overview" className="nx-section border-t border-gray-100">
        <div className="container-page">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/40 font-bold mb-5">Project Overview</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight mb-12 max-w-3xl">
            The next evolution of DeFi is autonomous, but must be verifiable.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "01",
                title: "Agentic Allocation",
                body: "Dynamic fund routing based on on-chain neural predictive models. The agent constantly scans Aave, Uniswap V4, Curve, and GMX for optimal risk-adjusted yield."
              },
              {
                n: "02",
                title: "Guardian Bounds",
                body: "Hardcoded smart contract constraints. The AI literally cannot make a transaction that violates your max risk, stop-loss, or protocol concentration limits."
              },
              {
                n: "03",
                title: "0G Proofs",
                body: "Every AI inference, market snapshot, and decision is posted to 0G's Data Availability layer. Anyone can run the verifier node to audit the protocol independently."
              },
            ].map((f) => (
              <div key={f.n} className="nx-card p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-transform duration-300">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/30 font-bold mb-4">{f.n}</p>
                <h3 className="text-xl font-semibold mb-3 text-[#191919]">{f.title}</h3>
                <p className="text-sm text-[#191919]/60 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="bg-[#F9F9F9] border-t border-b border-gray-200/80 py-16">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Total Value Locked", value: "$47.2M" },
            { label: "Current APY", value: "14.3%" },
            { label: "AI Decisions Made", value: "128,401" },
            { label: "Guardian Violations", value: "0" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-display font-normal text-[#191919] tracking-tight">{s.value}</p>
              <p className="text-xs text-[#191919]/40 uppercase tracking-wider font-bold mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Whitepaper ── */}
      <section id="whitepaper" className="nx-section border-b border-gray-100">
        <div className="container-page grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/40 font-bold mb-5">Whitepaper</p>
            <h2 className="text-3xl sm:text-4xl font-display font-normal leading-tight tracking-tight mb-6">
              Read the full technical specification.
            </h2>
            <p className="text-sm text-[#191919]/60 leading-relaxed mb-8">
              Dive deep into the mathematics of our Guardian Policy, the neural network architecture,
              and how 0G Network enables massive-scale data availability for DeFAI.
            </p>
            <Link href="/whitepaper">
              <button className="nx-btn-primary inline-flex gap-2.5">
                Go to Whitepaper Spec
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="nx-card p-8 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            {[
              { label: "Architecture", desc: "Modular agent + vault + guardian system design.", icon: Cpu },
              { label: "Risk Model", desc: "Formal bounds on drawdown, slippage, and concentration.", icon: ShieldCheck },
              { label: "Proof System", desc: "ZK-based verification of AI inference on 0G DA.", icon: Database },
              { label: "Tokenomics", desc: "Performance fees, governance token, and incentives.", icon: Award },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 py-3 border-b border-gray-100/80 last:border-0">
                <div className="w-9 h-9 rounded bg-[#F4F3F3] flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-[#191919]/60" />
                </div>
                <div>
                  <p className="font-semibold text-[#191919] text-sm">{item.label}</p>
                  <p className="text-xs text-[#191919]/50 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security / Audit ── */}
      <section id="security" className="bg-[#191919] nx-section">
        <div className="container-page">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-5">Security</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-3xl sm:text-4xl font-display font-normal leading-tight tracking-tight text-white max-w-2xl">
              Every vault is protected by cryptographic guarantees.
            </h2>
            <Link href="/security">
              <button className="px-6 py-3.5 bg-white text-[#191919] text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                Verify Audits & Parameters
              </button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Smart Contract Audit", sub: "Independent audit by Consensys Diligence. 0 critical issues." },
              { title: "Guardian Policy", sub: "Mathematically enforced bounds. AI cannot exceed risk limits." },
              { title: "Open Source", sub: "Full codebase on GitHub. Anyone can verify the logic." },
            ].map((s) => (
              <div key={s.title} className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <h3 className="font-semibold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-white py-24 border-t border-gray-100 text-center">
        <div className="container-page max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-display font-normal leading-tight tracking-tight text-[#191919] mb-6">
            Ready to earn verifiable yield?
          </h2>
          <p className="text-[#191919]/60 text-base mb-10 leading-relaxed">
            Connect your wallet and deposit in under 2 minutes. Your Guardian policy activates immediately.
          </p>
          <Link href="/dashboard">
            <button className="nx-btn-primary text-base px-8 py-4 gap-2">
              Open the Vault
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, User, Copy, Check, ChevronDown, ExternalLink, ShieldCheck, Wallet } from "lucide-react";
import { useBalance } from "wagmi";
import { formatUnits } from "viem";

function Logo() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className="w-6 h-6 animate-float" style={{ animationDuration: '3s' }}>
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
  { href: "/technology", label: "Technology" },
  { href: "/faq", label: "Q&A" },
  { href: "/whitepaper", label: "Whitepaper" },
];

function PrivyConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const address = user?.wallet?.address;
  const { data: balance } = useBalance({ 
    address: address as `0x${string}`,
    query: { enabled: !!address, refetchInterval: 5000 } 
  });

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  if (!ready) {
    return (
      <button className="nx-btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button 
        onClick={login} 
        className="nx-btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-[0_4px_12px_rgba(25,25,25,0.15)] transition-all"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  const getAvatarGradient = (addr: string) => {
    if (!addr) return "from-[#191919] to-[#6B6B6B]";
    const num = parseInt(addr.slice(2, 10), 16);
    const gradients = [
      "from-[#191919] to-[#6B6B6B]",
      "from-[#2E6BFF] to-[#00D09B]",
      "from-[#FF5858] to-[#F09819]",
      "from-[#8A2387] to-[#E94057]",
      "from-[#11998e] to-[#38ef7d]",
      "from-[#FF007A] to-[#7928CA]",
    ];
    return gradients[num % gradients.length];
  };

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const avatarGradient = getAvatarGradient(address || "");

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 bg-white hover:bg-[#F9F9F9] text-[#191919] px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200/80 shadow-sm transition-all duration-200"
      >
        {/* Unique Gradient Avatar */}
        <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${avatarGradient} border border-white shadow-sm shrink-0`} />
        
        <span className="font-mono text-xs">{truncatedAddress}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#191919]/40 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Click Outside Overlay to close dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2.5 w-72 bg-white border border-gray-200/90 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-4 z-50 nx-anim-fade-in origin-top-right">
          {/* Profile Header */}
          <div className="px-4 pb-3 border-b border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${avatarGradient} border border-white shadow-sm flex items-center justify-center shrink-0`}>
              <User className="w-4 h-4 text-white/95" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#191919] truncate">NexusVault Investor</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">0G Galileo</span>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="p-4 space-y-3.5">
            <div>
              <p className="text-[10px] font-semibold text-[#191919]/40 uppercase tracking-wider mb-1.5">Wallet Address</p>
              <div className="flex items-center justify-between bg-[#F9F9F9] border border-gray-100/80 rounded-xl p-2.5 font-mono text-[11px] text-[#191919]/70">
                <span className="truncate mr-2">{address}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all shrink-0 text-[#191919]/50 hover:text-[#191919]"
                  title="Copy Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#F9F9F9] border border-gray-100/80 rounded-xl">
              <div>
                <p className="text-[10px] font-semibold text-[#191919]/40 uppercase tracking-wider">Available Balance</p>
                <p className="text-base font-bold text-[#191919] mt-0.5">
                  {balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4) : "0.0000"} A0GI
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-gray-100/60 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#191919]/70" />
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="px-2 pt-1 border-t border-gray-100 space-y-1">
            <a
              href={`https://chainscan-galileo.0g.ai/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-[#191919]/70 hover:bg-[#F9F9F9] hover:text-[#191919] transition-all"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#191919]/40" />
                View on Chainscan
              </span>
            </a>
            
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                Disconnect Wallet
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/80 px-6 sm:px-10 md:px-14 py-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <Link href="/" className="flex items-center gap-2.5 text-[#191919] hover:opacity-90 transition-opacity">
          <Logo />
          <span className="font-semibold text-[15px] tracking-tight">NexusVault</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nx-nav-link ${pathname === href ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <PrivyConnectButton />
          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 hover:bg-[#F4F3F3] rounded-lg transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5 text-[#191919]" /> : <Menu className="w-5 h-5 text-[#191919]" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed top-[61px] left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-md lg:hidden nx-anim-fade-in">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? "bg-[#F4F3F3] text-[#191919] font-medium"
                    : "text-[#191919]/70 hover:bg-[#F4F3F3] hover:text-[#191919]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

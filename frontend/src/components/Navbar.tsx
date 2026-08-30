"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

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

  if (!ready) {
    return <button className="nx-btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">Loading...</button>;
  }

  if (!authenticated) {
    return (
      <button onClick={login} className="nx-btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold">
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#F4F3F3] text-[#191919] font-mono px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center border border-gray-100 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
        {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : "Connected"}
      </div>
      <button onClick={logout} className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Disconnect">
        <LogOut className="w-4 h-4" />
      </button>
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

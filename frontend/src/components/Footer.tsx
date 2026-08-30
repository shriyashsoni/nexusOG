import Link from "next/link";

function Logo({ size = "w-6 h-6" }: { size?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={size}>
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#F9F9F9] border-t border-gray-200/80 py-12 w-full z-10 relative mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5 text-[#191919]">
          <Logo />
          <span className="font-semibold text-sm tracking-tight">NexusVault</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Docs", href: "/docs" },
            { label: "Technology", href: "/technology" },
            { label: "Q&A", href: "/faq" },
            { label: "Whitepaper", href: "/whitepaper" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs text-[#191919]/45 hover:text-[#191919] transition-colors font-semibold"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[#191919]/30">© 2026 NexusVault · Built on 0G Network</p>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { PenLine, LogIn, Sun, Moon } from "lucide-react";

const NAV_LINKS = ["Releases", "Pricing", "Blog", "Contact"];

export default function Navbar() {
  const [dark, setDark] = useState(true);

  return (
    <header
      className="relative z-50 flex-shrink-0 flex items-center px-5 h-[58px] gap-6"
      style={{
        background: "rgba(7, 7, 26, 0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #f97316 100%)",
            boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          }}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path d="M3 3h4v10H3zM9 3h4v4H9zM9 9h4v4H9z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
        <span className="font-semibold text-[15px] tracking-tight" style={{ color: "#f8fafc" }}>
          NotePackz
        </span>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="px-3 py-1.5 rounded-md text-sm transition-colors duration-150"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748b")}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <NavBtn icon={<PenLine size={13} />} label="Open Notepad" />
        <NavBtn icon={<LogIn size={13} />} label="Sign In" />
        <button
          onClick={() => setDark((d) => !d)}
          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#64748b",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748b")}
          title="Toggle theme"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}

function NavBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 h-[34px] rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        color: "#94a3b8",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
        (e.currentTarget as HTMLElement).style.color = "#94a3b8";
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

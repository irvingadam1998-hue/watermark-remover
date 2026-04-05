"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

export default function PageShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close, { once: true });
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/rotate", label: t.nav.rotate },
    { href: "/trim", label: t.nav.trim },
    { href: "/mute", label: t.nav.mute },
    { href: "/about", label: t.nav.about },
    { href: "/privacy", label: t.nav.privacy },
    { href: "/contact", label: t.nav.contact },
  ];

  const linkStyle = (href: string): React.CSSProperties => ({
    padding: "5px 10px", borderRadius: 7,
    fontSize: 12, fontWeight: 600, textDecoration: "none",
    color: active === href ? "var(--ink)" : "var(--muted)",
    background: active === href ? "var(--bg)" : "transparent",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{
        background: "var(--white)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "var(--orange)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
          }}>U</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" }}>Unmarkify</span>
        </Link>

        {/* Desktop nav — hidden below 768px */}
        <nav style={{
          display: "flex", gap: 2, flex: 1,
          overflowX: "auto", scrollbarWidth: "none",
        }}
          className="page-shell-nav"
        >
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle(l.href)}>{l.label}</Link>
          ))}
        </nav>

        {/* Language switcher — desktop */}
        <div className="page-shell-lang" style={{ display: "flex", gap: 2, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 2, flexShrink: 0 }}>
          {(["en", "es"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "4px 10px", borderRadius: 6, border: "none",
              fontSize: 11, fontWeight: 800, cursor: "pointer",
              background: lang === l ? "var(--black)" : "transparent",
              color: lang === l ? "#fff" : "var(--muted)",
              letterSpacing: "0.04em", transition: "all 0.12s",
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        {/* Status chip — hidden on small screens */}
        <div className="page-shell-status" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "var(--muted)",
          padding: "4px 10px", borderRadius: 99,
          border: "1px solid var(--border)", background: "var(--bg)", flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
          {t.status}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="hamburger"
          onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        {/* Mobile nav drawer */}
        <div
          className={`mobile-nav ${menuOpen ? "open" : ""}`}
          onClick={e => e.stopPropagation()}
        >
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ color: active === l.href ? "var(--orange)" : "var(--ink)", fontWeight: active === l.href ? 700 : 600 }}
            >{l.label}</Link>
          ))}
          <div className="nav-divider" />
          <div style={{ display: "flex", gap: 6, padding: "6px 12px" }}>
            {(["en", "es"] as const).map(l => (
              <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }} style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "1px solid var(--border)",
                fontSize: 12, fontWeight: 800, cursor: "pointer",
                background: lang === l ? "var(--black)" : "var(--bg)",
                color: lang === l ? "#fff" : "var(--muted)",
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{
        padding: "14px 24px", borderTop: "1px solid var(--border)",
        background: "var(--white)", fontSize: 11, color: "var(--muted)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
      }}>
        <span>{t.footer.copy}</span>
        <div style={{ display: "flex", gap: 16 }}>
          {[{ href: "/about", label: t.nav.about }, { href: "/privacy", label: t.nav.privacy }, { href: "/contact", label: t.nav.contact }].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "var(--muted)", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
        <span>{t.footer.tech}</span>
      </footer>

      {/* PageShell-specific responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .page-shell-nav  { display: none !important; }
          .page-shell-status { display: none !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </div>
  );
}

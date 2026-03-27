"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export default function PageShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const { t, lang, setLang } = useLang();

  const navLinks = [
    { href: "/",        label: t.nav.home    },
    { href: "/rotate",  label: t.nav.rotate  },
    { href: "/trim",    label: t.nav.trim    },
    { href: "/mute",    label: t.nav.mute    },
    { href: "/about",   label: t.nav.about   },
    { href: "/privacy", label: t.nav.privacy },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{
        background: "var(--white)", borderBottom: "1px solid var(--border)",
        padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", gap: 24,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "var(--orange)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
          }}>W</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" }}>WaterCut</span>
        </Link>

        <nav style={{ display: "flex", gap: 2, flex: 1 }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "5px 10px", borderRadius: 7,
              fontSize: 12, fontWeight: 600, textDecoration: "none",
              color: active === l.href ? "var(--ink)" : "var(--muted)",
              background: active === l.href ? "var(--bg)" : "transparent",
            }}>{l.label}</Link>
          ))}
        </nav>

        {/* Language switcher */}
        <div style={{ display: "flex", gap: 2, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 2, flexShrink: 0 }}>
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

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "var(--muted)",
          padding: "4px 10px", borderRadius: 99,
          border: "1px solid var(--border)", background: "var(--bg)", flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
          {t.status}
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{
        padding: "14px 32px", borderTop: "1px solid var(--border)",
        background: "var(--white)", fontSize: 11, color: "var(--muted)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span>{t.footer.copy}</span>
        <div style={{ display: "flex", gap: 16 }}>
          {[{href:"/about",label:t.nav.about},{href:"/privacy",label:t.nav.privacy},{href:"/contact",label:t.nav.contact}].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "var(--muted)", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
        <span>{t.footer.tech}</span>
      </footer>
    </div>
  );
}

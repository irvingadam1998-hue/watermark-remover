"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;

  return (
    <PageShell active="/contact">
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 8 }}>{c.tag}</p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 16 }}>{c.h1}</h1>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>{c.intro}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {c.options.map(opt => (
            <div key={opt.title} style={{ padding: "20px 24px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginBottom: 3 }}>{opt.title}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{opt.desc}</p>
              </div>
              <a href={`mailto:soporte@Unmarkify.app${opt.subject ? `?subject=${opt.subject}` : ""}`} style={{ padding: "8px 16px", borderRadius: 8, background: "var(--black)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
                {opt.label}
              </a>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px 24px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
            <strong style={{ color: "var(--ink)" }}>{c.responseLabel}</strong> {c.responseVal}<br /><br />
            <strong style={{ color: "var(--ink)" }}>{c.langLabel}</strong> {c.langVal}<br /><br />
            <strong style={{ color: "var(--ink)" }}>{c.noteLabel}</strong> {c.noteVal}
          </p>
        </div>
      </div>
    </PageShell>
  );
}

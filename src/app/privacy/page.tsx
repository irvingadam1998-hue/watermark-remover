"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

export default function Privacy() {
  const { t } = useLang();
  const p = t.privacy;

  return (
    <PageShell active="/privacy">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 8 }}>{p.tag}</p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 8 }}>{p.h1}</h1>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>{p.updated}</p>
        </div>

        <div style={{ padding: "20px 24px", background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#166534", marginBottom: 4 }}>{p.highlightTitle}</p>
            <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.6 }}>{p.highlightBody}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {p.sections.map(s => (
            <div key={s.title} style={{ padding: "20px 24px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{s.icon}</span>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>{s.title}</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

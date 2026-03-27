"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <PageShell active="/about">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 8 }}>{a.tag}</p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 16 }}>{a.h1}</h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 560 }}>{a.intro}</p>
        </div>

        {a.sections.map(s => (
          <div key={s.title} style={{ marginBottom: 12, padding: "24px 28px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ padding: "24px 28px", background: "var(--black)", borderRadius: 14, marginTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{a.stack}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {a.stackItems.map(item => (
              <div key={item.name} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

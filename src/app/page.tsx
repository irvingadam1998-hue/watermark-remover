"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useFFmpeg, Region, RemoveMode, QualitySettings, ProcessingStats } from "@/hooks/useFFmpeg";
import RegionSelector from "@/components/RegionSelector";
import { useLang } from "@/contexts/LangContext";
import { Translations } from "@/lib/i18n";

interface VideoInfo { src: string; file: File; width: number; height: number; }
type Step = 1 | 2 | 3;

const MODE_IDS: RemoveMode[] = ["delogo", "blur", "pixelate"];
const MODE_ICONS = ["✦", "◎", "▦"];
const PRESET_IDS: QualitySettings["preset"][] = ["ultrafast", "fast", "medium", "slow"];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ step, t }: { step: Step; t: Translations }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">U</div>
        <span className="logo-name">Unmarkify</span>
      </div>

      <div>
        <p className="sidebar-tagline">
          {t.sidebar.tagline1}<br />{t.sidebar.tagline2}<em>{t.sidebar.tagline3}</em>
        </p>
        <p className="sidebar-sub">{t.sidebar.sub}</p>
      </div>

      <div className="steps">
        {t.steps.map((s, idx) => {
          const n = (idx + 1) as Step;
          const state = step > n ? "done" : step === n ? "active" : "idle";
          return (
            <div className="step" key={n}>
              <div className={`step-dot ${state}`}>
                {state === "done"
                  ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2 2L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : n}
              </div>
              <div className="step-text">
                <strong>{s.label}</strong>
                <span>{s.hint}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="privacy-pill">
        <strong>{t.sidebar.privacy}</strong><br />
        {t.sidebar.privacyDesc}
      </div>
    </aside>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing({ onFile, t }: { onFile: (f: File) => void; t: Translations }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (file: File) => {
    if (file.type.startsWith("video/")) onFile(file);
  };

  const toolHrefs = ["/", "/rotate", "/trim", "/mute"];

  return (
    <>
      {/* Hero */}
      <section className="hero fade-up">
        <div className="hero-left">
          <p className="hero-tag">{t.hero.tag}</p>
          <h1 className="hero-h1">
            {t.hero.h1a}<br /><em>{t.hero.h1b}</em><br />{t.hero.h1c}
          </h1>
          <p className="hero-p">{t.hero.p}</p>
          <div className="hero-badges">
            {t.hero.badges.map(b => (
              <span className="badge" key={b}>{b}</span>
            ))}
          </div>
        </div>

        <div>
          <div
            className={`drop-zone ${dragging ? "over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pick(f); }}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); }} />
            <div className="drop-icon-wrap">🎬</div>
            <p className="drop-title">{t.drop.title}</p>
            <p className="drop-sub">{t.drop.sub}</p>
            <div className="pills">
              {["MP4", "MOV", "AVI", "MKV", "WebM"].map(f => <span key={f} className="pill">{f}</span>)}
            </div>
          </div>

          <div className="features">
            {t.features.map((f, i) => {
              const icons = ["⚡", "🎯", "🔀"];
              return (
                <div className="feature" key={i}>
                  <div className="feature-ico">{icons[i]}</div>
                  <div><strong>{f.title}</strong><p>{f.desc}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <p className="section-label">{t.hiw.label}</p>
        <h2 className="section-h2">{t.hiw.title}</h2>
        <p className="section-sub">{t.hiw.sub}</p>
        <div className="hiw">
          {t.hiw.steps.map(s => (
            <div className="hiw-step" key={s.n}>
              <div className="hiw-n">{s.n}</div>
              <div className="hiw-emoji">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="section">
        <p className="section-label">{t.tools.label}</p>
        <h2 className="section-h2">{t.tools.title}</h2>
        <p className="section-sub">{t.tools.sub}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 28 }}>
          {t.tools.list.map((tool, i) => {
            const icons = ["🎨", "🔄", "✂️", "🔇"];
            return (
              <Link key={toolHrefs[i]} href={toolHrefs[i]} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "20px", borderRadius: 14,
                  background: tool.active ? "var(--black)" : "var(--white)",
                  border: `1.5px solid ${tool.active ? "var(--black)" : "var(--border)"}`,
                  cursor: "pointer", transition: "all 0.18s", height: "100%",
                }}
                  onMouseEnter={e => { if (!tool.active) { (e.currentTarget as HTMLDivElement).style.borderColor = "#999"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; } }}
                  onMouseLeave={e => { if (!tool.active) { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; } }}
                >
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{icons[i]}</div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: tool.active ? "#fff" : "var(--ink)", marginBottom: 5 }}>{tool.title}</p>
                  <p style={{ fontSize: 12, color: tool.active ? "rgba(255,255,255,0.5)" : "var(--muted)", lineHeight: 1.5 }}>{tool.desc}</p>
                  {tool.active && <span style={{ display: "inline-block", marginTop: 10, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "var(--orange)", color: "#fff", letterSpacing: "0.05em" }}>ACTIVO</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <p className="section-label">{t.faq.label}</p>
        <h2 className="section-h2">{t.faq.title}</h2>
        <div className="faq-grid">
          {t.faq.items.map((item, i) => (
            <details className="faq-item" key={i}>
              <summary className="faq-q">
                <span>{item.q}</span>
                <span className="faq-arrow">›</span>
              </summary>
              <p className="faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

// ── Editor ────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t, lang, setLang } = useLang();
  const { load, loaded, loading, progress, removeWatermark } = useFFmpeg();

  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [mode, setMode] = useState<RemoveMode>("delogo");
  const [quality, setQuality] = useState<QualitySettings>({ preset: "fast", crf: 23 });
  const [stats, setStats] = useState<ProcessingStats | null>(null);

  const step: Step = !videoInfo ? 1 : !outputUrl ? 2 : 3;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close, { once: true });
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  // Build MODES and PRESETS from translation keys (IDs and icons are fixed)
  const MODES: { id: RemoveMode; icon: string; label: string }[] = MODE_IDS.map((id, i) => ({
    id,
    icon: MODE_ICONS[i],
    label: t.editor.modes[i]?.label ?? id,
  }));

  const PRESETS: { id: QualitySettings["preset"]; label: string }[] = PRESET_IDS.map((id, i) => ({
    id,
    label: t.editor.presets[i]?.label ?? id,
  }));

  const loadVideo = useCallback((file: File) => {
    const src = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.src = src;
    v.onloadedmetadata = () => {
      setVideoInfo({ src, file, width: v.videoWidth, height: v.videoHeight });
      setRegions([]); setOutputUrl(null); setStats(null);
    };
  }, []);

  const handleProcess = async () => {
    if (!videoInfo || regions.length === 0) return;
    if (!loaded) await load();
    setProcessing(true); setOutputUrl(null); setStats(null);
    try {
      const result = await removeWatermark(videoInfo.file, regions, mode, quality);
      if (result) { setOutputUrl(URL.createObjectURL(result.blob)); setStats(result.stats); }
    } finally { setProcessing(false); }
  };

  const reset = () => {
    setVideoInfo(null); setRegions([]); setOutputUrl(null);
    setDrawMode(false); setStats(null);
  };

  const fmt = {
    size: (b: number) => b >= 1048576 ? `${(b / 1048576).toFixed(1)}MB` : `${(b / 1024).toFixed(0)}KB`,
    time: (ms: number) => ms >= 60000 ? `${Math.floor(ms / 60000)}m${Math.round((ms % 60000) / 1000)}s` : `${(ms / 1000).toFixed(1)}s`,
  };

  const breadcrumbLabel = step === 1
    ? t.nav.home
    : step === 2
      ? (videoInfo?.file.name ?? "Editor")
      : t.result.title;

  return (
    <div className="app-shell">
      <Sidebar step={step} t={t} />

      {/* Top bar */}
      <header className="top-bar">
        <div className="breadcrumb">
          <span>Unmarkify</span>
          <span className="breadcrumb-sep">/</span>
          <strong>{breadcrumbLabel}</strong>
        </div>

        <nav style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }}>
          {[
            { href: "/rotate", label: t.nav.rotate },
            { href: "/trim", label: t.nav.trim },
            { href: "/mute", label: t.nav.mute },
            { href: "/about", label: t.nav.about },
            { href: "/privacy", label: t.nav.privacy },
            { href: "/contact", label: t.nav.contact },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "5px 10px", borderRadius: 7,
              fontSize: 12, fontWeight: 600, textDecoration: "none",
              color: "var(--muted)", transition: "all 0.12s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >{l.label}</Link>
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

        <div className="status-chip">
          <div className="live-dot" />
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
        <div className={`mobile-nav ${menuOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
          {[
            { href: "/rotate", label: t.nav.rotate },
            { href: "/trim", label: t.nav.trim },
            { href: "/mute", label: t.nav.mute },
          ].map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>)}
          <div className="nav-divider" />
          {[
            { href: "/about", label: t.nav.about },
            { href: "/privacy", label: t.nav.privacy },
            { href: "/contact", label: t.nav.contact },
          ].map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>)}
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

      {/* Content */}
      <main className="content">

        {/* ── Step 1: Landing ── */}
        {!videoInfo && <Landing onFile={loadVideo} t={t} />}

        {/* ── Steps 2 / 3: Editor ── */}
        {videoInfo && (
          <div className="editor fade-up">
            <div className="panel">

              {/* Toolbar */}
              <div className="toolbar">
                <div className="file-chip">
                  <div className="file-chip-icon">🎥</div>
                  <div>
                    <div className="file-chip-name">{videoInfo.file.name}</div>
                    <div className="file-chip-meta">{videoInfo.width}×{videoInfo.height} · {fmt.size(videoInfo.file.size)}</div>
                  </div>
                </div>

                <div className="divider" />

                <button
                  className={`toolbar-btn ${!drawMode ? "active-play" : ""}`}
                  onClick={() => setDrawMode(false)}
                >{t.editor.play}</button>

                <button
                  className={`toolbar-btn ${drawMode ? "active-draw" : ""}`}
                  onClick={() => setDrawMode(true)}
                >{t.editor.draw}</button>

                {regions.length > 0 && (
                  <button className="toolbar-btn danger" onClick={() => setRegions([])}>
                    {t.editor.clear} ({regions.length})
                  </button>
                )}

                <button
                  className={`process-btn ml-auto ${processing ? "running" : ""}`}
                  onClick={handleProcess}
                  disabled={processing || regions.length === 0 || loading}
                >
                  {loading ? t.editor.loading : processing ? `⚡ ${progress}%` : t.editor.process}
                </button>

                <button className="btn-ghost" onClick={reset}>{t.editor.change}</button>
              </div>

              {/* Mode tabs */}
              <div className="mode-bar">
                <span className="mode-label">{t.editor.effect}</span>
                <div className="mode-tabs">
                  {MODES.map(m => (
                    <button key={m.id} className={`mode-tab ${mode === m.id ? "active" : ""}`} onClick={() => setMode(m.id)}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="quality-bar">
                <div className="quality-group">
                  <span className="quality-lbl">{t.editor.speed}</span>
                  <div className="preset-tabs">
                    {PRESETS.map(p => (
                      <button key={p.id} className={`preset-tab ${quality.preset === p.id ? "active" : ""}`}
                        onClick={() => setQuality(q => ({ ...q, preset: p.id }))}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="quality-group">
                  <div className="crf-group">
                    <span className="crf-lbl">{t.editor.quality}</span>
                    <span className="crf-lbl">{t.editor.high}</span>
                    <input type="range" min={18} max={28} step={1} value={quality.crf}
                      className="crf" onChange={e => setQuality(q => ({ ...q, crf: +e.target.value }))} />
                    <span className="crf-lbl">{t.editor.low}</span>
                    <span className="crf-val">{quality.crf}</span>
                  </div>
                </div>
              </div>

              {/* Hint */}
              {drawMode && (
                <div className="hint-bar">
                  {t.editor.hint}
                </div>
              )}

              {/* Progress */}
              {(processing || loading) && (
                <div className="prog-bar">
                  <div className="prog-row">
                    <span>{loading ? t.editor.loadingFFmpeg : t.editor.processingVideo}</span>
                    <span>{loading ? "" : `${progress}%`}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: loading ? "10%" : `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Video */}
              <RegionSelector
                videoSrc={videoInfo.src}
                videoWidth={videoInfo.width}
                videoHeight={videoInfo.height}
                regions={regions}
                onRegionsChange={setRegions}
                drawMode={drawMode}
              />

              {/* Region chips */}
              {regions.length > 0 && (
                <div className="region-bar">
                  {regions.map((r, i) => (
                    <div key={i} className="region-chip">
                      <div className="region-num">{i + 1}</div>
                      <span className="region-size">{r.width}×{r.height}px</span>
                      <button className="region-del"
                        onClick={() => setRegions(regions.filter((_, j) => j !== i))}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Result ── */}
            {outputUrl && (
              <div className="panel result-panel fade-up">
                <div className="result-head">
                  <div className="result-title">
                    {t.result.title} <span className="result-badge">{t.result.ready}</span>
                  </div>
                  <button className="btn-ghost" onClick={reset}>{t.result.newVideo}</button>
                </div>

                {stats && (
                  <div className="stats-row">
                    <div className="stat">
                      <div className="stat-label">{t.result.stats.time}</div>
                      <div className="stat-val">{fmt.time(stats.durationMs)}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">{t.result.stats.original}</div>
                      <div className="stat-val">{fmt.size(stats.inputSize)}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">{t.result.stats.result}</div>
                      <div className="stat-val">{fmt.size(stats.outputSize)}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">{t.result.stats.reduction}</div>
                      <div className={`stat-val ${stats.outputSize < stats.inputSize ? "pos" : "neg"}`}>
                        {stats.outputSize < stats.inputSize
                          ? `-${((1 - stats.outputSize / stats.inputSize) * 100).toFixed(1)}%`
                          : `+${((stats.outputSize / stats.inputSize - 1) * 100).toFixed(1)}%`}
                      </div>
                    </div>
                  </div>
                )}

                <div className="result-video">
                  <video src={outputUrl} controls />
                </div>

                <div className="result-foot">
                  <a
                    href={outputUrl}
                    download={videoInfo.file.name.replace(/(\.\w+)$/, "_sin_watermark$1")}
                    className="btn-download"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 2v7m0 0L5 6.5m2.5 2.5L10 6.5M2 12.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.result.download}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="foot">
        <span>{t.footer.copy}</span>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { href: "/about", label: t.nav.about },
            { href: "/privacy", label: t.nav.privacy },
            { href: "/contact", label: t.nav.contact },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "var(--muted)", textDecoration: "none", fontSize: 11 }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ fontSize: 11 }}>{t.footer.tech}</span>
      </footer>
    </div>
  );
}

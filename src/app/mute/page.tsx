"use client";

import { useState, useRef, useCallback } from "react";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

interface FileInfo { file: File; src: string; }

export default function MutePage() {
  const { load, loaded, loading, progress, removeAudio } = useFFmpeg();
  const { t } = useLang();
  const m = t.mute;

  const [fileInfo,   setFileInfo]   = useState<FileInfo | null>(null);
  const [dragging,   setDragging]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputUrl,  setOutputUrl]  = useState<string | null>(null);
  const [stats,      setStats]      = useState<{ inputSize: number; outputSize: number; durationMs: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    setFileInfo({ file, src: URL.createObjectURL(file) });
    setOutputUrl(null); setStats(null);
  }, []);

  const handleProcess = async () => {
    if (!fileInfo) return;
    if (!loaded) await load();
    setProcessing(true); setOutputUrl(null); setStats(null);
    try {
      const result = await removeAudio(fileInfo.file);
      if (result) { setOutputUrl(URL.createObjectURL(result.blob)); setStats(result.stats); }
    } finally { setProcessing(false); }
  };

  const fmt = {
    size: (b: number) => b >= 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`,
    time: (ms: number) => ms >= 60000 ? `${Math.floor(ms/60000)}m ${Math.round((ms%60000)/1000)}s` : `${(ms/1000).toFixed(1)}s`,
  };

  return (
    <PageShell active="/mute">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 6 }}>{m.tag}</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 8 }}>{m.h1}</h1>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>{m.desc}</p>
        </div>

        {!fileInfo && (
          <div className={`drop-zone ${dragging ? "over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
            <div className="drop-icon-wrap">🔇</div>
            <p className="drop-title">{m.uploadTitle}</p>
            <p className="drop-sub">{m.uploadSub}</p>
            <div className="pills">{["MP4","MOV","AVI","MKV","WebM"].map(f => <span key={f} className="pill">{f}</span>)}</div>
          </div>
        )}

        {fileInfo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel">
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎥</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{fileInfo.file.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>{fmt.size(fileInfo.file.size)}</p>
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => { setFileInfo(null); setOutputUrl(null); }}>↩</button>
              </div>

              <div style={{ background: "#161616", display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <video src={fileInfo.src} controls style={{ maxHeight: 320, maxWidth: "100%", borderRadius: 8 }} />
              </div>

              <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {m.cards.map(c => (
                  <div key={c.label} style={{ padding: "14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 2 }}>{c.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(processing || loading) && (
                <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
                    <span>{loading ? m.loading : m.removing}</span>
                    <span>{loading ? "" : `${progress}%`}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--orange)", borderRadius: 99, width: loading ? "10%" : `${progress}%`, transition: "width 0.3s ease" }} />
                  </div>
                </div>
              )}

              <div style={{ padding: "0 16px 16px" }}>
                <button onClick={handleProcess} disabled={processing || loading} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: processing ? "var(--orange)" : "var(--black)",
                  color: "#fff", cursor: processing || loading ? "wait" : "pointer",
                  fontSize: 14, fontWeight: 700, transition: "all 0.15s", opacity: loading ? 0.6 : 1,
                }}>
                  {loading ? m.loading : processing ? `${m.processing} ${progress}%` : m.process}
                </button>
              </div>
            </div>

            {outputUrl && stats && (
              <div className="panel result-panel fade-up">
                <div className="result-head">
                  <div className="result-title">{t.result.title} <span className="result-badge">{t.result.ready}</span></div>
                  <button className="btn-ghost" onClick={() => { setFileInfo(null); setOutputUrl(null); setStats(null); }}>{t.result.newVideo}</button>
                </div>
                <div className="stats-row">
                  <div className="stat"><div className="stat-label">{t.result.stats.time}</div><div className="stat-val">{fmt.time(stats.durationMs)}</div></div>
                  <div className="stat"><div className="stat-label">{t.result.stats.original}</div><div className="stat-val">{fmt.size(stats.inputSize)}</div></div>
                  <div className="stat"><div className="stat-label">{t.result.stats.result}</div><div className="stat-val">{fmt.size(stats.outputSize)}</div></div>
                  <div className="stat"><div className="stat-label">{t.result.stats.reduction}</div>
                    <div className={`stat-val ${stats.outputSize < stats.inputSize ? "pos" : "neg"}`}>
                      {stats.outputSize < stats.inputSize
                        ? `-${((1 - stats.outputSize / stats.inputSize) * 100).toFixed(1)}%`
                        : `+${((stats.outputSize / stats.inputSize - 1) * 100).toFixed(1)}%`}
                    </div>
                  </div>
                </div>
                <div className="result-video"><video src={outputUrl} controls /></div>
                <div className="result-foot">
                  <a href={outputUrl} download={fileInfo.file.name.replace(/(\.\w+)$/, "_muted$1")} className="btn-download">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v7m0 0L5 6.5m2.5 2.5L10 6.5M2 12.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {m.download}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}

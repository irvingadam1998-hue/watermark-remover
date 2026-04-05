"use client";

import { useState, useRef, useCallback } from "react";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

const ROTATION_FILTERS = ["transpose=1", "transpose=2", "transpose=1,transpose=1", "hflip", "vflip"];

interface FileInfo { file: File; src: string; }

export default function RotatePage() {
  const { load, loaded, loading, progress, rotateVideo } = useFFmpeg();
  const { t } = useLang();
  const r = t.rotate;

  const [fileInfo,    setFileInfo]    = useState<FileInfo | null>(null);
  const [filterIdx,   setFilterIdx]   = useState(0);
  const [dragging,    setDragging]    = useState(false);
  const [processing,  setProcessing]  = useState(false);
  const [outputUrl,   setOutputUrl]   = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    setFileInfo({ file, src: URL.createObjectURL(file) });
    setOutputUrl(null);
  }, []);

  const handleProcess = async () => {
    if (!fileInfo) return;
    if (!loaded) await load();
    setProcessing(true); setOutputUrl(null);
    try {
      const result = await rotateVideo(fileInfo.file, ROTATION_FILTERS[filterIdx]);
      if (result) setOutputUrl(URL.createObjectURL(result.blob));
    } finally { setProcessing(false); }
  };

  const fmt = (b: number) => b >= 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`;

  return (
    <PageShell active="/rotate">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 6 }}>{r.tag}</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 8 }}>{r.h1}</h1>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>{r.desc}</p>
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
            <div className="drop-icon-wrap">🔄</div>
            <p className="drop-title">{r.uploadTitle}</p>
            <p className="drop-sub">{r.uploadSub}</p>
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
                    <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>{fmt(fileInfo.file.size)}</p>
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => { setFileInfo(null); setOutputUrl(null); }}>↩</button>
              </div>

              <div style={{ background: "#161616", display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <video src={fileInfo.src} controls style={{ maxHeight: 340, maxWidth: "100%", borderRadius: 8 }} />
              </div>

              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{r.rotationType}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {r.rotations.map((rot, i) => (
                    <button key={i} onClick={() => setFilterIdx(i)} style={{
                      padding: "12px 8px", borderRadius: 10, textAlign: "center",
                      border: `1.5px solid ${filterIdx === i ? "var(--black)" : "var(--border)"}`,
                      background: filterIdx === i ? "var(--black)" : "var(--white)",
                      color: filterIdx === i ? "#fff" : "var(--muted)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>
                        {["↻","↺","↕","↔","↕"][i]}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700 }}>{rot.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "0 16px 16px" }}>
                <button onClick={handleProcess} disabled={processing || loading} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: processing ? "var(--orange)" : "var(--black)",
                  color: "#fff", cursor: processing || loading ? "wait" : "pointer",
                  fontSize: 14, fontWeight: 700, transition: "all 0.15s", opacity: loading ? 0.6 : 1,
                }}>
                  {loading ? r.loading : processing ? `${r.processing} ${progress}%` : r.process}
                </button>
              </div>
            </div>

            {outputUrl && (
              <div className="panel result-panel fade-up">
                <div className="result-head">
                  <div className="result-title">{t.result.title} <span className="result-badge">{t.result.ready}</span></div>
                  <button className="btn-ghost" onClick={() => { setFileInfo(null); setOutputUrl(null); }}>{t.result.newVideo}</button>
                </div>
                <div className="result-video"><video src={outputUrl} controls /></div>
                <div className="result-foot">
                  <a href={outputUrl} download={fileInfo.file.name.replace(/(\.\w+)$/, "_rotated$1")} className="btn-download">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v7m0 0L5 6.5m2.5 2.5L10 6.5M2 12.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {r.download}
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

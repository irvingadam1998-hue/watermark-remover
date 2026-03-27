"use client";

import { useState, useRef, useCallback } from "react";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import PageShell from "@/components/PageShell";
import { useLang } from "@/contexts/LangContext";

interface FileInfo { file: File; src: string; duration: number; }

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function TrimPage() {
  const { load, loaded, loading, progress, trimVideo } = useFFmpeg();
  const { t } = useLang();
  const tr = t.trim;

  const [fileInfo,   setFileInfo]   = useState<FileInfo | null>(null);
  const [start,      setStart]      = useState(0);
  const [end,        setEnd]        = useState(0);
  const [dragging,   setDragging]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outputUrl,  setOutputUrl]  = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const src = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.src = src;
    v.onloadedmetadata = () => {
      setFileInfo({ file, src, duration: v.duration });
      setStart(0); setEnd(Math.floor(v.duration)); setOutputUrl(null);
    };
  }, []);

  const handleProcess = async () => {
    if (!fileInfo) return;
    if (!loaded) await load();
    setProcessing(true); setOutputUrl(null);
    try {
      const result = await trimVideo(fileInfo.file, start, end);
      if (result) setOutputUrl(URL.createObjectURL(result.blob));
    } finally { setProcessing(false); }
  };

  const fmt = (b: number) => b >= 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`;
  const trimDuration = end - start;

  return (
    <PageShell active="/trim">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)", marginBottom: 6 }}>{tr.tag}</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 8 }}>{tr.h1}</h1>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>{tr.desc}</p>
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
            <div className="drop-icon-wrap">✂️</div>
            <p className="drop-title">{tr.uploadTitle}</p>
            <p className="drop-sub">{tr.uploadSub}</p>
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
                    <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>{fmt(fileInfo.file.size)} · {fmtTime(fileInfo.duration)}</p>
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => { setFileInfo(null); setOutputUrl(null); }}>↩</button>
              </div>

              <div style={{ background: "#161616", display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <video ref={videoRef} src={fileInfo.src} controls style={{ maxHeight: 300, maxWidth: "100%", borderRadius: 8 }} />
              </div>

              <div style={{ padding: "20px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  {[
                    { label: tr.start,    value: fmtTime(start),        color: "var(--ink)"    },
                    { label: tr.duration, value: fmtTime(trimDuration), color: "var(--orange)" },
                    { label: tr.end,      value: fmtTime(end),          color: "var(--ink)"    },
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: "center", flex: 1 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 900, fontFamily: "monospace", color: item.color, letterSpacing: "-0.02em" }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: tr.startPoint, value: start, min: 0, max: Math.max(0, end - 1), onChange: (v: number) => { setStart(v); if (videoRef.current) videoRef.current.currentTime = v; } },
                    { label: tr.endPoint,   value: end,   min: Math.min(start + 1, fileInfo.duration), max: fileInfo.duration, onChange: (v: number) => { setEnd(v); if (videoRef.current) videoRef.current.currentTime = v; } },
                  ].map(sl => (
                    <div key={sl.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{sl.label}</label>
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--muted)" }}>{fmtTime(sl.value)}</span>
                      </div>
                      <input type="range" min={sl.min} max={sl.max} step={0.5} value={sl.value}
                        style={{ width: "100%", accentColor: "var(--orange)", cursor: "pointer" }}
                        onChange={e => sl.onChange(Number(e.target.value))} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>{tr.hint}</p>
              </div>

              <div style={{ padding: "0 16px 16px" }}>
                <button onClick={handleProcess} disabled={processing || loading || trimDuration <= 0} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: processing ? "var(--orange)" : trimDuration <= 0 ? "#e5e3de" : "var(--black)",
                  color: trimDuration <= 0 && !processing ? "#aaa" : "#fff",
                  cursor: processing || loading || trimDuration <= 0 ? "not-allowed" : "pointer",
                  fontSize: 14, fontWeight: 700, transition: "all 0.15s",
                }}>
                  {loading ? tr.loading : processing ? `${tr.processing} ${progress}%` : tr.process}
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
                  <a href={outputUrl} download={fileInfo.file.name.replace(/(\.\w+)$/, "_trimmed$1")} className="btn-download">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v7m0 0L5 6.5m2.5 2.5L10 6.5M2 12.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {tr.download}
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

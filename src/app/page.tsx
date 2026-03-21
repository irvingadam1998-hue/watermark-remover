"use client";

import { useState, useRef, useCallback } from "react";
import { useFFmpeg, Region } from "@/hooks/useFFmpeg";
import RegionSelector from "@/components/RegionSelector";

interface VideoInfo {
  src: string;
  file: File;
  width: number;
  height: number;
}

type Step = 1 | 2 | 3;

const STEPS = [
  { n: 1 as Step, label: "Subir video",    desc: "MP4, MOV, AVI, MKV, WebM" },
  { n: 2 as Step, label: "Marcar región",  desc: "Dibuja sobre la marca de agua" },
  { n: 3 as Step, label: "Descargar",      desc: "Video listo sin marca de agua" },
];

function Sidebar({ step }: { step: Step }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="logo-mark">W</div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em", color: "#fff" }}>WaterCut</span>
      </div>

      {/* Headline */}
      <div>
        <p className="sidebar-title">
          Elimina<br />marcas de<br />agua de<br /><span>tus videos.</span>
        </p>
        <p className="sidebar-desc" style={{ marginTop: 12 }}>
          Procesado en tu navegador con FFmpeg.wasm. Sin servidores, sin límites.
        </p>
      </div>

      {/* Steps */}
      <div className="steps-v">
        {STEPS.map((s) => {
          const state = step > s.n ? "done" : step === s.n ? "active" : "idle";
          return (
            <div className="step-row" key={s.n}>
              <div className={`step-num ${state}`}>
                {state === "done"
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : s.n}
              </div>
              <div className="step-info">
                <strong>{s.label}</strong>
                <p>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy */}
      <div className="privacy-badge">
        <strong>🔒 100% Privado</strong><br />
        Tu video nunca sale de tu dispositivo. Todo ocurre en el navegador.
      </div>
    </aside>
  );
}

export default function Home() {
  const { load, loaded, loading, progress, removeWatermark } = useFFmpeg();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const step: Step = !videoInfo ? 1 : !outputUrl ? 2 : 3;

  const loadVideo = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const src = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.src = src;
    v.onloadedmetadata = () => {
      setVideoInfo({ src, file, width: v.videoWidth, height: v.videoHeight });
      setRegions([]);
      setOutputUrl(null);
    };
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadVideo(file);
  };

  const handleProcess = async () => {
    if (!videoInfo || regions.length === 0) return;
    if (!loaded) await load();
    setProcessing(true);
    setOutputUrl(null);
    try {
      const blob = await removeWatermark(videoInfo.file, regions);
      if (blob) setOutputUrl(URL.createObjectURL(blob));
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setVideoInfo(null); setRegions([]); setOutputUrl(null); setDrawMode(false); };

  const outputFileName =
    videoInfo?.file.name.replace(/(\.\w+)$/, "_sin_watermark$1") ?? "output.mp4";

  return (
    <div className="app-shell">
      <Sidebar step={step} />

      {/* ── Top bar ── */}
      <header className="top-bar">
        <div className="breadcrumb">
          <span>WaterCut</span>
          <span className="breadcrumb-sep">/</span>
          <strong>
            {step === 1 ? "Subir video" : step === 2 ? videoInfo?.file.name ?? "Editor" : "Resultado"}
          </strong>
        </div>
        <div className="status-chip">
          <div className="live-dot" />
          Local · Sin uploads
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="content">

        {/* ── PASO 1: UPLOAD ── */}
        {!videoInfo && (
          <section className="upload-hero fade-up">
            <div>
              <p className="hero-kicker">Herramienta gratuita</p>
              <h1 className="hero-h1">
                Quita cualquier<br /><em>marca de agua</em><br />en segundos.
              </h1>
              <p className="hero-sub">
                Selecciona la zona exacta, FFmpeg borra el logo y descarga tu video limpio. Sin registro, sin costo.
              </p>
            </div>

            <div>
              <div
                className={`drop-card ${dragging ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef} type="file" accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) loadVideo(f); }}
                />
                <div className="drop-icon">🎬</div>
                <p className="drop-title">Arrastra tu video aquí</p>
                <p className="drop-sub">o haz clic para seleccionar un archivo</p>
                <div className="format-pills">
                  {["MP4", "MOV", "AVI", "MKV", "WebM"].map(f => <span key={f} className="pill">{f}</span>)}
                </div>
              </div>

              <div className="feature-row">
                {[
                  { icon: "⚡", title: "Multi-thread", desc: "FFmpeg.wasm optimizado con Web Workers" },
                  { icon: "🎯", title: "Pixel perfect", desc: "Dibuja la región exacta a eliminar" },
                  { icon: "📁", title: "Sin límites", desc: "Cualquier tamaño, cualquier formato" },
                ].map(f => (
                  <div className="feature-card" key={f.title}>
                    <div className="feature-icon">{f.icon}</div>
                    <div><strong>{f.title}</strong><p>{f.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PASO 2 / 3: EDITOR + RESULTADO ── */}
        {videoInfo && (
          <div className="editor-layout fade-up">

            {/* Panel unificado */}
            <div className="panel">
              {/* ── Toolbar ── */}
              <div className="panel-head" style={{ flexWrap: "wrap", gap: 8 }}>
                {/* Izquierda: info archivo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="file-icon" style={{ width: 32, height: 32, fontSize: 14 }}>🎥</div>
                  <div>
                    <p className="file-name" style={{ fontSize: 12 }}>{videoInfo.file.name}</p>
                    <p className="file-meta">{videoInfo.width}×{videoInfo.height}px · {(videoInfo.file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>

                {/* Centro: acciones */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setDrawMode(false)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                      borderColor: !drawMode ? "#0a0a0a" : "#ddd9d2",
                      background: !drawMode ? "#0a0a0a" : "transparent",
                      color: !drawMode ? "white" : "#9a9890",
                    }}
                  >▶ Reproducir</button>

                  <button
                    onClick={() => setDrawMode(true)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                      borderColor: drawMode ? "#ff4500" : "#ddd9d2",
                      background: drawMode ? "#ff4500" : "transparent",
                      color: drawMode ? "white" : "#9a9890",
                    }}
                  >✏ Marcar zona</button>

                  {regions.length > 0 && (
                    <button
                      onClick={() => setRegions([])}
                      style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: "1.5px solid #ddd9d2", cursor: "pointer",
                        background: "transparent", color: "#9a9890", transition: "all 0.15s",
                      }}
                    >✕ Limpiar ({regions.length})</button>
                  )}

                  <button
                    style={{
                      padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                      border: "none", cursor: processing || regions.length === 0 || loading ? "not-allowed" : "pointer",
                      background: processing ? "#ff4500" : regions.length === 0 ? "#e5e3de" : "#0a0a0a",
                      color: regions.length === 0 && !processing ? "#aaa" : "white",
                      transition: "all 0.15s", opacity: loading ? 0.5 : 1,
                    }}
                    onClick={handleProcess}
                    disabled={processing || regions.length === 0 || loading}
                  >
                    {loading ? "Cargando…" : processing ? `${progress}%` : "⚡ Eliminar marca"}
                  </button>
                </div>

                {/* Derecha */}
                <button className="btn-sm" onClick={reset}>↩ Cambiar</button>
              </div>

              {/* Hints */}
              {(drawMode || (!loaded && !loading)) && (
                <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {drawMode && (
                    <span style={{ fontSize: 12, color: "#ff4500" }}>💡 Pausa el video y arrastra para marcar la zona con marca de agua</span>
                  )}
                  {!loaded && !loading && (
                    <span style={{ fontSize: 12, color: "#92400e" }}>⚠️ La primera vez se descarga FFmpeg (~30 MB)</span>
                  )}
                </div>
              )}

              {/* Progress bar */}
              {(processing || loading) && (
                <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div className="prog-label">
                    <span>{loading ? "Descargando FFmpeg…" : "Procesando video…"}</span>
                    <span>{loading ? "" : `${progress}%`}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: loading ? "15%" : `${progress}%` }} />
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

              {/* Regiones marcadas */}
              {regions.length > 0 && (
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {regions.map((r, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 10px", borderRadius: 8,
                      background: "#fff8f6", border: "1px solid rgba(255,69,0,0.15)",
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, background: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white" }}>{i + 1}</div>
                      <span style={{ fontSize: 11, color: "#6b6b60", fontFamily: "monospace" }}>{r.width}×{r.height}px</span>
                      <button
                        onClick={() => setRegions(regions.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 14, lineHeight: 1, padding: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resultado */}
            {outputUrl && (
              <div className="panel fade-up" style={{ border: "1.5px solid #86efac" }}>
                <div className="panel-head" style={{ background: "#f0fdf4" }}>
                  <div className="result-header" style={{ margin: 0 }}>
                    <h2 style={{ color: "#166534" }}>Resultado</h2>
                    <span className="result-badge">✓ LISTO</span>
                  </div>
                  <button className="btn-sm" onClick={reset}>Nuevo video</button>
                </div>
                <div style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
                  <video
                    src={outputUrl}
                    controls
                    style={{ maxHeight: 420, maxWidth: "100%", borderRadius: 8, display: "block", objectFit: "contain" }}
                  />
                </div>
                <div className="panel-body">
                  <a href={outputUrl} download={outputFileName} className="btn-download">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8m0 0L5 7m3 3l3-3M2 13h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Descargar video sin marca de agua
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="foot">
        <span>WaterCut © 2025</span>
        <span>FFmpeg.wasm · Sin servidores · Sin límites</span>
      </footer>
    </div>
  );
}

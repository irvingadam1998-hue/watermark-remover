"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Region } from "@/hooks/useFFmpeg";
import { useLang } from "@/contexts/LangContext";

interface Props {
  videoSrc: string;
  videoWidth: number;
  videoHeight: number;
  regions: Region[];
  onRegionsChange: (regions: Region[]) => void;
  drawMode: boolean;
}

interface DrawingState { startX: number; startY: number; currentX: number; currentY: number; }

export default function RegionSelector({ videoSrc, videoWidth, videoHeight, regions, onRegionsChange, drawMode }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const outerRef    = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing]         = useState<DrawingState | null>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const { t } = useLang();
  const r = t.region;

  const isPortrait = videoHeight > videoWidth;

  useEffect(() => {
    const update = () => {
      const containerW = outerRef.current?.clientWidth ?? 700;

      // Portrait videos: cap at 45% of container width so they don't look tiny
      // Landscape videos: fill container width, capped at MAX_H height
      const MAX_H = isPortrait ? 560 : 480;
      const maxW  = isPortrait ? Math.min(Math.round(containerW * 0.52), 400) : containerW;

      let w = maxW;
      let h = Math.round(w * videoHeight / videoWidth);
      if (h > MAX_H) {
        h = MAX_H;
        w = Math.round(h * videoWidth / videoHeight);
      }
      setDisplaySize({ width: w, height: h });
    };

    update();
    const ro = new ResizeObserver(update);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [videoWidth, videoHeight, isPortrait]);

  const toVideo = useCallback(
    (x: number, y: number) => ({
      x: Math.round((x / displaySize.width)  * videoWidth),
      y: Math.round((y / displaySize.height) * videoHeight),
    }),
    [displaySize, videoWidth, videoHeight]
  );

  // Paint canvas overlays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !displaySize.width) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sx = displaySize.width  / videoWidth;
    const sy = displaySize.height / videoHeight;

    regions.forEach((r, i) => {
      const rx = r.x * sx, ry = r.y * sy, rw = r.width * sx, rh = r.height * sy;
      ctx.fillStyle   = "rgba(255, 69, 0, 0.2)";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = "#ff4500";
      ctx.lineWidth   = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(rx, ry, rw, rh);
      // Number badge
      ctx.fillStyle = "#ff4500";
      ctx.beginPath();
      ctx.roundRect(rx + 4, ry + 4, 22, 20, 4);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), rx + 15, ry + 18);
      ctx.textAlign = "left";
    });

    if (drawing) {
      const x = Math.min(drawing.startX, drawing.currentX);
      const y = Math.min(drawing.startY, drawing.currentY);
      const w = Math.abs(drawing.currentX - drawing.startX);
      const h = Math.abs(drawing.currentY - drawing.startY);
      ctx.fillStyle   = "rgba(255, 69, 0, 0.12)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#ff4500";
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }
  }, [regions, drawing, displaySize, videoWidth, videoHeight]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getPos(e);
    setDrawing({ startX: x, startY: y, currentX: x, currentY: y });
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    setDrawing(d => d && { ...d, currentX: x, currentY: y });
  };
  const onMouseUp = () => {
    if (!drawing) return;
    const x = Math.min(drawing.startX, drawing.currentX);
    const y = Math.min(drawing.startY, drawing.currentY);
    const w = Math.abs(drawing.currentX - drawing.startX);
    const h = Math.abs(drawing.currentY - drawing.startY);
    if (w > 5 && h > 5) {
      const tl = toVideo(x, y), br = toVideo(x + w, y + h);
      onRegionsChange([...regions, { x: tl.x, y: tl.y, width: br.x - tl.x, height: br.y - tl.y }]);
    }
    setDrawing(null);
  };

  // Layout: portrait → side-by-side (video | info panel), landscape → full width
  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: isPortrait ? "row" : "column",
        alignItems: isPortrait ? "stretch" : "center",
        background: "#161616",
        minHeight: 200,
      }}
    >
      {/* ── Video area ── */}
      <div style={{
        flex: isPortrait ? "0 0 auto" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isPortrait ? "24px 20px 24px 24px" : "20px 0",
        background: "#161616",
      }}>
        {displaySize.width > 0 && (
          <div style={{
            position: "relative",
            width: displaySize.width,
            height: displaySize.height,
            borderRadius: 8,
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}>
            <video
              src={videoSrc}
              width={displaySize.width}
              height={displaySize.height}
              style={{ display: "block", width: displaySize.width, height: displaySize.height }}
              controls={!drawMode}
            />
            <canvas
              ref={canvasRef}
              width={displaySize.width}
              height={displaySize.height}
              style={{
                position: "absolute", top: 0, left: 0,
                width: displaySize.width, height: displaySize.height,
                pointerEvents: drawMode ? "auto" : "none",
                cursor: drawMode ? "crosshair" : "default",
              }}
              onMouseDown={drawMode ? onMouseDown : undefined}
              onMouseMove={drawMode ? onMouseMove : undefined}
              onMouseUp={drawMode ? onMouseUp : undefined}
              onMouseLeave={drawMode ? onMouseUp : undefined}
            />
          </div>
        )}
      </div>

      {/* ── Info panel lateral (solo en portrait) ── */}
      {isPortrait && (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          padding: "24px 24px 24px 16px",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Datos del video */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>
              {r.info}
            </p>
            {[
              { label: r.rows[0], value: `${videoWidth}×${videoHeight}px` },
              { label: r.rows[1], value: r.portrait },
              { label: r.rows[2], value: regions.length === 0 ? r.none : `${regions.length} ${regions.length > 1 ? r.zones : r.zone}` },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "monospace" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Instrucciones */}
          <div style={{
            padding: "14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {r.howTo}
            </p>
            {r.howToSteps.map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: "rgba(255,69,0,0.8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Estado del modo */}
          <div style={{
            padding: "10px 14px",
            background: drawMode ? "rgba(255,69,0,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${drawMode ? "rgba(255,69,0,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 8,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: drawMode ? "#ff4500" : "rgba(255,255,255,0.2)",
              boxShadow: drawMode ? "0 0 8px rgba(255,69,0,0.6)" : "none",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, color: drawMode ? "rgba(255,160,100,0.9)" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
              {drawMode ? r.modeActive : r.modePlay}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

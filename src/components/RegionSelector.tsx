"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Region } from "@/hooks/useFFmpeg";

interface Props {
  videoSrc: string;
  videoWidth: number;
  videoHeight: number;
  regions: Region[];
  onRegionsChange: (regions: Region[]) => void;
  drawMode: boolean;
}

interface DrawingState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function RegionSelector({ videoSrc, videoWidth, videoHeight, regions, onRegionsChange, drawMode }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const outerRef     = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing]         = useState<DrawingState | null>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const MAX_H = 440;

  useEffect(() => {
    const update = () => {
      const containerW = outerRef.current?.clientWidth ?? 700;
      // Fit within containerW x MAX_H maintaining aspect ratio
      let w = containerW;
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
  }, [videoWidth, videoHeight]);

  const toVideo = useCallback(
    (x: number, y: number) => ({
      x: Math.round((x / displaySize.width) * videoWidth),
      y: Math.round((y / displaySize.height) * videoHeight),
    }),
    [displaySize, videoWidth, videoHeight]
  );

  // Paint canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !displaySize.width) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sx = displaySize.width / videoWidth;
    const sy = displaySize.height / videoHeight;

    regions.forEach((r, i) => {
      const rx = r.x * sx, ry = r.y * sy, rw = r.width * sx, rh = r.height * sy;
      ctx.fillStyle   = "rgba(255, 69, 0, 0.18)";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = "#ff4500";
      ctx.lineWidth   = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.fillStyle = "#ff4500";
      ctx.beginPath();
      ctx.roundRect(rx, ry, 22, 20, 4);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), rx + 11, ry + 14);
      ctx.textAlign = "left";
    });

    if (drawing) {
      const x = Math.min(drawing.startX, drawing.currentX);
      const y = Math.min(drawing.startY, drawing.currentY);
      const w = Math.abs(drawing.currentX - drawing.startX);
      const h = Math.abs(drawing.currentY - drawing.startY);
      ctx.fillStyle   = "rgba(255, 69, 0, 0.1)";
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
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
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

  return (
    <div ref={outerRef} style={{ width: "100%", background: "#111", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, padding: "16px 0" }}>
      {displaySize.width > 0 && (
        <div style={{ position: "relative", width: displaySize.width, height: displaySize.height, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
          <video
            src={videoSrc}
            width={displaySize.width}
            height={displaySize.height}
            style={{ display: "block", width: displaySize.width, height: displaySize.height }}
            controls
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
  );
}

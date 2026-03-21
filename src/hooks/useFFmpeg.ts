"use client";

import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");

  const load = useCallback(async () => {
    if (loaded || loading) return;
    setLoading(true);
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on("progress", ({ progress: p }) => {
      setProgress(Math.round(p * 100));
    });

    ffmpeg.on("log", ({ message }) => {
      setLog(message);
    });

    // Cargar FFmpeg.wasm multi-thread desde CDN (más rápido, requiere COOP/COEP headers)
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });

    setLoaded(true);
    setLoading(false);
  }, [loaded, loading]);

  const removeWatermark = useCallback(
    async (videoFile: File, regions: Region[]): Promise<Blob | null> => {
      if (!ffmpegRef.current || !loaded) return null;
      const ffmpeg = ffmpegRef.current;

      setProgress(0);
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      // Construir el filtro delogo para cada región
      const delogoFilters = regions
        .map((r) => `delogo=x=${r.x}:y=${r.y}:w=${r.width}:h=${r.height}`)
        .join(",");

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", delogoFilters,
        "-c:a", "copy",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");

      return new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
    },
    [loaded]
  );

  return { load, loaded, loading, progress, log, removeWatermark };
}

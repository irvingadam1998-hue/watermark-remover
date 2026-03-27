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

export type RemoveMode = "delogo" | "blur" | "pixelate";

export interface QualitySettings {
  preset: "ultrafast" | "fast" | "medium" | "slow";
  crf: number; // 18 (mejor calidad) – 28 (más comprimido)
}

export interface ProcessingStats {
  durationMs: number;
  inputSize: number;
  outputSize: number;
}

// Eliminar logo usando el filtro delogo de FFmpeg
function buildDelogoArgs(regions: Region[]): string[] {
  const filter = regions
    .map((r) => `delogo=x=${r.x}:y=${r.y}:w=${r.width}:h=${r.height}`)
    .join(",");
  return ["-vf", filter];
}

// Difuminar regiones usando boxblur + overlay
function buildBlurArgs(regions: Region[]): string[] {
  const n = regions.length;
  let complex = `[0:v]split=${n + 1}[base]${regions.map((_, i) => `[s${i}]`).join("")};`;
  regions.forEach((r, i) => {
    complex += `[s${i}]crop=${r.width}:${r.height}:${r.x}:${r.y},boxblur=luma_radius=15:luma_power=1[b${i}];`;
  });
  regions.forEach((r, i) => {
    const inp = i === 0 ? "base" : `t${i - 1}`;
    const out = i === n - 1 ? "out" : `t${i}`;
    complex += `[${inp}][b${i}]overlay=${r.x}:${r.y}[${out}];`;
  });
  return ["-filter_complex", complex.slice(0, -1), "-map", "[out]"];
}

// Pixelar regiones usando scale down/up con filtro neighbor
function buildPixelateArgs(regions: Region[]): string[] {
  const n = regions.length;
  const block = 10;
  let complex = `[0:v]split=${n + 1}[base]${regions.map((_, i) => `[s${i}]`).join("")};`;
  regions.forEach((r, i) => {
    complex += `[s${i}]crop=${r.width}:${r.height}:${r.x}:${r.y},scale=iw/${block}:ih/${block}:flags=neighbor,scale=${r.width}:${r.height}:flags=neighbor[p${i}];`;
  });
  regions.forEach((r, i) => {
    const inp = i === 0 ? "base" : `t${i - 1}`;
    const out = i === n - 1 ? "out" : `t${i}`;
    complex += `[${inp}][p${i}]overlay=${r.x}:${r.y}[${out}];`;
  });
  return ["-filter_complex", complex.slice(0, -1), "-map", "[out]"];
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

    // Cargar FFmpeg.wasm multi-thread desde archivos locales (public/ffmpeg/)
    const baseURL = "/ffmpeg";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });

    setLoaded(true);
    setLoading(false);
  }, [loaded, loading]);

  const removeWatermark = useCallback(
    async (
      videoFile: File,
      regions: Region[],
      mode: RemoveMode = "delogo",
      quality: QualitySettings = { preset: "fast", crf: 23 }
    ): Promise<{ blob: Blob; stats: ProcessingStats } | null> => {
      if (!ffmpegRef.current || !loaded) return null;
      const ffmpeg = ffmpegRef.current;

      setProgress(0);
      const startTime = Date.now();

      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      let filterArgs: string[];
      if (mode === "blur") {
        filterArgs = buildBlurArgs(regions);
      } else if (mode === "pixelate") {
        filterArgs = buildPixelateArgs(regions);
      } else {
        filterArgs = buildDelogoArgs(regions);
      }

      // Para blur/pixelate (filter_complex), hay que mapear el audio explícitamente
      const audioMapArgs = mode !== "delogo" ? ["-map", "0:a?"] : [];

      await ffmpeg.exec([
        "-i", "input.mp4",
        ...filterArgs,
        ...audioMapArgs,
        "-c:a", "copy",
        "-c:v", "libx264",
        "-preset", quality.preset,
        "-crf", String(quality.crf),
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");

      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      const stats: ProcessingStats = {
        durationMs: Date.now() - startTime,
        inputSize: videoFile.size,
        outputSize: blob.size,
      };

      return { blob, stats };
    },
    [loaded]
  );

  const rotateVideo = useCallback(
    async (videoFile: File, filter: string): Promise<{ blob: Blob; stats: ProcessingStats } | null> => {
      if (!ffmpegRef.current || !loaded) return null;
      const ffmpeg = ffmpegRef.current;
      setProgress(0);
      const startTime = Date.now();
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
      await ffmpeg.exec(["-i", "input.mp4", "-vf", filter, "-c:a", "copy", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "output.mp4"]);
      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      return { blob, stats: { durationMs: Date.now() - startTime, inputSize: videoFile.size, outputSize: blob.size } };
    },
    [loaded]
  );

  const trimVideo = useCallback(
    async (videoFile: File, startSec: number, endSec: number): Promise<{ blob: Blob; stats: ProcessingStats } | null> => {
      if (!ffmpegRef.current || !loaded) return null;
      const ffmpeg = ffmpegRef.current;
      setProgress(0);
      const startTime = Date.now();
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
      await ffmpeg.exec(["-i", "input.mp4", "-ss", String(startSec), "-to", String(endSec), "-c", "copy", "output.mp4"]);
      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      return { blob, stats: { durationMs: Date.now() - startTime, inputSize: videoFile.size, outputSize: blob.size } };
    },
    [loaded]
  );

  const removeAudio = useCallback(
    async (videoFile: File): Promise<{ blob: Blob; stats: ProcessingStats } | null> => {
      if (!ffmpegRef.current || !loaded) return null;
      const ffmpeg = ffmpegRef.current;
      setProgress(0);
      const startTime = Date.now();
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
      await ffmpeg.exec(["-i", "input.mp4", "-an", "-c:v", "copy", "output.mp4"]);
      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      return { blob, stats: { durationMs: Date.now() - startTime, inputSize: videoFile.size, outputSize: blob.size } };
    },
    [loaded]
  );

  return { load, loaded, loading, progress, log, removeWatermark, rotateVideo, trimVideo, removeAudio };
}

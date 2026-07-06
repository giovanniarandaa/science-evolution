"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mini-interacción de "mantener presionado para llenar una barra".
 * Modela las condiciones de gameplay: friccionar (llegar al umbral) y
 * soplar (llenar del todo). Reporta el valor alcanzado (0..1) al soltar.
 */
export function HoldMiniGame({
  verb,
  threshold,
  onComplete,
  onCancel,
}: {
  verb: string;
  threshold: number;
  onComplete: (value: number) => void;
  onCancel: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const holdingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    timerRef.current = setInterval(() => {
      progressRef.current = Math.min(1, progressRef.current + 0.04);
      setProgress(progressRef.current);
    }, 50);
  };

  const release = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    stopTimer();
    onComplete(progressRef.current);
  };

  useEffect(() => () => stopTimer(), []);

  const pct = Math.round(progress * 100);
  const markPct = Math.round(threshold * 100);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <p className="mb-1 text-lg font-semibold capitalize">{verb}</p>
        <p className="mb-4 text-sm text-zinc-500">
          Mantené presionado hasta pasar la marca, después soltá.
        </p>

        <div className="relative mb-4 h-4 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-zinc-700"
            style={{ left: `${markPct}%` }}
          />
        </div>

        <button
          type="button"
          aria-label={verb}
          onPointerDown={start}
          onPointerUp={release}
          onPointerLeave={release}
          className="w-full cursor-pointer rounded-lg bg-orange-500 py-4 font-semibold text-white select-none active:bg-orange-600"
        >
          {verb} — mantené presionado
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-sm text-zinc-500 hover:text-zinc-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

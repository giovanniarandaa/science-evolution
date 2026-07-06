"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Piece, Process, ProcessStep } from "@/game/types";
import { elementsById } from "@/content";
import { useGameStore } from "@/game/store";
import { initAssembly, makeAssemblyReducer } from "./assembly-reducer";
import { PieceThumb } from "./PieceThumb";
import { SciencePanel, type SciSubject } from "./SciencePanel";
import { TaladroArcoScene, type SceneProps } from "./scenes/TaladroArcoScene";

const SCENES: Record<string, ComponentType<SceneProps>> = {
  fuego: TaladroArcoScene,
};

type GestureKind = "rub" | "hold" | "tap";

/** Verbo imperativo por gesto de fabricación, para la zona de trabajo. */
const CRAFT_VERB: Record<string, string> = {
  tallar: "Tallá",
  torcer: "Torcé",
  picar: "Picá",
  amasar: "Amasá",
  moler: "Molé",
};

/** Dónde se trabaja el material para fabricar la pieza (centro de la escena). */
const CRAFT_ZONE = { x: 260, y: 205 };

/**
 * La Mesa de Trabajo: fabricás las piezas desde materiales y armás el invento
 * pieza por pieza (mecánica central). Dos fases: FABRICAR (arrastrás un material a
 * la zona de trabajo y lo tallás/torcés/picás) → ENSAMBLAR (arrastrás las piezas a
 * la escena). Los gestos de uso (friccionar/soplar) se hacen IN SITU, sin modales.
 */
export function Mesa({ process }: { process: Process }) {
  const reducer = useMemo(() => makeAssemblyReducer(process), [process]);
  const [state, dispatch] = useReducer(reducer, undefined, initAssembly);
  const discover = useGameStore((s) => s.discover);

  useEffect(() => {
    state.produced.forEach((id) => discover(id));
  }, [state.produced, discover]);

  const activeStep: ProcessStep | undefined = process.steps[state.stepIndex];
  const SceneComp = SCENES[process.id];
  const completedStepIds = useMemo(
    () => process.steps.slice(0, state.stepIndex).map((s) => s.id),
    [process, state.stepIndex],
  );

  // --- geometría de la escena ---
  const scene = process.scene;
  const slots = scene?.slots ?? {};
  const [, , vbW, vbH] = (scene?.viewBox ?? "0 0 520 400").split(/\s+/).map(Number);
  const W = vbW || 520;
  const H = vbH || 400;
  const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });
  const slotPos = (slot: string) => pct(slots[slot].x, slots[slot].y);

  // --- materiales de fabricación (de los pasos 'craft') ---
  const craftMaterials = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const s of process.steps) {
      if (s.interaction?.type === "craft" && !seen.has(s.interaction.material)) {
        seen.add(s.interaction.material);
        list.push(s.interaction.material);
      }
    }
    return list;
  }, [process]);
  const nCraft = useMemo(
    () => process.steps.filter((s) => s.interaction?.type === "craft").length,
    [process],
  );
  const inCraftPhase = state.stepIndex < nCraft && !state.done;

  const pieceById = (id: string) => process.pieces?.find((p) => p.id === id);
  const emojiOf = (elementId?: string) =>
    (elementId ? elementsById[elementId]?.emoji : undefined) ?? "🔩";

  // --- paso activo ---
  const activeCraft = activeStep?.interaction?.type === "craft" ? activeStep.interaction : null;
  const activePlace = activeStep?.interaction?.type === "place" ? activeStep.interaction : null;
  const gesture = activeStep?.interaction?.type === "gesture" ? activeStep.interaction.gesture : null;
  const isGesture = !!gesture && !state.done;
  const gestureKind: GestureKind =
    gesture === "soplar" ? "hold" : gesture === "friccionar" || gesture === "torcer" ? "rub" : "tap";
  const threshold = activeStep?.conditions?.[0]?.param ?? 1;

  // --- ciencia (panel "?") ---
  const [sci, setSci] = useState<{ subject: SciSubject; madeFrom?: SciSubject } | null>(null);
  const openElementSci = (id: string) => setSci({ subject: elementsById[id] });
  const openPieceSci = (p: Piece) =>
    setSci({
      subject: { name: p.name, science: p.science },
      madeFrom: p.fromElement ? elementsById[p.fromElement] : undefined,
    });

  // --- drag (materiales → zona de trabajo; piezas → slot) ---
  const dropRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);

  const startDrag = (e: ReactPointerEvent, id: string) => {
    e.preventDefault();
    setDrag({ id, x: e.clientX, y: e.clientY });
    const move = (ev: PointerEvent) =>
      setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDrag(null);
      const g = dropRef.current?.getBoundingClientRect();
      const hit =
        g &&
        ev.clientX >= g.left - 40 &&
        ev.clientX <= g.right + 40 &&
        ev.clientY >= g.top - 40 &&
        ev.clientY <= g.bottom + 40;
      if (!hit) return;
      if (activeCraft) dispatch({ type: "attempt", attempt: { kind: "craft", material: id } });
      else if (activePlace)
        dispatch({ type: "attempt", attempt: { kind: "place", piece: id, slot: activePlace.slot } });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // --- gestos IN SITU (rub / hold / tap) ---
  const [gp, setGp] = useState(0);
  const gpRef = useRef(0);
  const lastRef = useRef<{ x: number; t: number } | null>(null);
  const holdRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    gpRef.current = 0;
    setGp(0);
    lastRef.current = null;
    holdRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, [state.stepIndex]);

  const completeGesture = () => {
    const value = gpRef.current;
    holdRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    dispatch({ type: "attempt", attempt: { kind: "gesture", value } });
  };
  const bump = (delta: number) => {
    gpRef.current = Math.min(1, Math.max(0, gpRef.current + delta));
    setGp(gpRef.current);
    if (gpRef.current >= threshold) completeGesture();
  };
  const onRubDown = (e: ReactPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastRef.current = { x: e.clientX, t: performance.now() };
  };
  const onRubMove = (e: ReactPointerEvent) => {
    const last = lastRef.current;
    if (!last) return;
    const now = performance.now();
    const dt = Math.max(16, now - last.t);
    const speed = Math.abs(e.clientX - last.x) / dt;
    lastRef.current = { x: e.clientX, t: now };
    bump(Math.min(0.05, speed * 0.05));
  };
  const onRubUp = () => {
    lastRef.current = null;
  };
  const startHold = () => {
    if (holdRef.current) return;
    holdRef.current = true;
    const loop = () => {
      if (!holdRef.current) return;
      bump(0.02);
      if (holdRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };
  const endHold = () => {
    holdRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };
  const gestureHint =
    gestureKind === "rub"
      ? "Frotá el arco de lado a lado ↔"
      : gestureKind === "hold"
        ? "Mantené presionado para soplar 💨"
        : (activeStep?.instruction ?? "Tocá la herramienta");

  const pieceUsed = (pieceId: string) =>
    state.filledSlots.some((slot) => process.steps.some(
      (s) => s.interaction?.type === "place" && s.interaction.slot === slot && s.interaction.piece === pieceId,
    ));

  return (
    <div className="min-h-screen w-full bg-stone-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 lg:flex-row lg:items-start">
        {/* ---------------- Mesa + bandeja ---------------- */}
        <div className="flex w-full flex-col gap-3 lg:max-w-xl">
          <header className="flex items-baseline justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-lime-700">
                {process.mission?.giver ?? "Misión"}
              </p>
              <h1 className="text-lg font-bold text-stone-800">
                {process.mission?.goal ?? process.name}
              </h1>
            </div>
            <span className="shrink-0 rounded-full bg-stone-200 px-3 py-1 font-mono text-xs text-stone-600">
              {Math.min(state.stepIndex, process.steps.length)} / {process.steps.length}
            </span>
          </header>

          {/* Escena */}
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-stone-300 shadow-inner"
            style={{
              aspectRatio: `${W} / ${H}`,
              background: "radial-gradient(120% 100% at 50% 0%, #efe7d6, #ded2ba)",
            }}
          >
            {SceneComp && (
              <SceneComp
                filledSlots={state.filledSlots}
                produced={state.produced}
                completedStepIds={completedStepIds}
                activeStepId={activeStep?.id}
                intensity={gestureKind === "rub" ? gp : 0}
              />
            )}

            {/* zona de trabajo (fabricar) o slot destino (ensamblar) */}
            {activeCraft ? (
              <div
                ref={dropRef}
                className="absolute flex h-20 w-24 -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-500 bg-amber-400/15 font-mono text-[10px] uppercase text-amber-700"
                style={pct(CRAFT_ZONE.x, CRAFT_ZONE.y)}
              >
                <span className="text-base">🪚</span>
                {CRAFT_VERB[activeCraft.gesture] ?? "Trabajá"} acá
              </div>
            ) : activePlace ? (
              <div
                ref={dropRef}
                className="absolute flex h-16 w-20 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-xl border-2 border-dashed border-lime-500 bg-lime-400/20 font-mono text-[10px] uppercase text-lime-700"
                style={slotPos(activePlace.slot)}
              >
                acá
              </div>
            ) : null}

            {/* capa de gesto IN SITU */}
            {isGesture && (
              <div
                className="absolute inset-0 z-10 select-none"
                style={{ touchAction: "none", cursor: gestureKind === "rub" ? "ew-resize" : "pointer" }}
                onPointerDown={
                  gestureKind === "rub" ? onRubDown : gestureKind === "hold" ? startHold : undefined
                }
                onPointerMove={gestureKind === "rub" ? onRubMove : undefined}
                onPointerUp={gestureKind === "rub" ? onRubUp : gestureKind === "hold" ? endHold : undefined}
                onPointerLeave={gestureKind === "hold" ? endHold : undefined}
                onClick={
                  gestureKind === "tap"
                    ? () => dispatch({ type: "attempt", attempt: { kind: "gesture" } })
                    : undefined
                }
              >
                <div className="absolute inset-x-0 top-3 flex justify-center">
                  <span className="rounded-full bg-stone-900/75 px-3 py-1 text-xs font-medium text-white shadow">
                    {gestureHint}
                  </span>
                </div>
                {gestureKind !== "tap" && (
                  <div className="absolute inset-x-0 bottom-16 flex justify-center">
                    <div className="relative h-2.5 w-1/2 overflow-hidden rounded-full bg-black/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-lime-500 to-orange-500 transition-[width] duration-75"
                        style={{ width: `${Math.round(gp * 100)}%` }}
                      />
                      <div
                        className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-stone-600"
                        style={{ left: `${Math.round(threshold * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* barra inferior: feedback + éxito/guía */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-4">
              {state.feedback && (
                <div
                  className={`pointer-events-auto rounded-md px-3 py-1.5 text-sm font-medium text-white shadow ${
                    state.feedback.kind === "success"
                      ? "bg-lime-600"
                      : state.feedback.kind === "error"
                        ? "bg-amber-600"
                        : "bg-stone-700"
                  }`}
                >
                  {state.feedback.text}
                </div>
              )}
              {state.done ? (
                <div className="pointer-events-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => openElementSci(process.produces)}
                    className="rounded-full bg-lime-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-lime-500"
                  >
                    🔬 La ciencia detrás
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "reset" })}
                    className="rounded-full bg-stone-800 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-stone-700"
                  >
                    ↺ Armar de nuevo
                  </button>
                </div>
              ) : !isGesture ? (
                <div className="pointer-events-auto rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-stone-600 shadow backdrop-blur">
                  {activeStep?.instruction ??
                    (inCraftPhase ? "Arrastrá el material a la zona de trabajo" : "Arrastrá la pieza al lugar resaltado")}
                </div>
              ) : null}
            </div>
          </div>

          {/* Bandeja: materiales (fabricar) o piezas (ensamblar) */}
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-stone-400">
              {inCraftPhase ? "Materiales — arrastrá a la zona de trabajo" : "Piezas fabricadas"}
            </p>
            <div className="flex flex-wrap gap-2">
              {inCraftPhase
                ? craftMaterials.map((matId) => {
                    const el = elementsById[matId];
                    const active = activeCraft?.material === matId;
                    return (
                      <div key={matId} className="relative">
                        <button
                          type="button"
                          aria-label={el?.name ?? matId}
                          onPointerDown={(e) => (active ? startDrag(e, matId) : undefined)}
                          disabled={!active}
                          className={`flex w-20 touch-none flex-col items-center gap-1 rounded-xl border p-2 transition ${
                            active
                              ? "cursor-grab border-amber-500 bg-amber-50 shadow ring-2 ring-amber-300"
                              : "border-stone-200 bg-stone-50 opacity-50"
                          }`}
                        >
                          <span className="text-2xl leading-none">{emojiOf(matId)}</span>
                          <span className="text-[10px] font-medium text-stone-600">{el?.name}</span>
                        </button>
                        {el?.science && (
                          <button
                            type="button"
                            aria-label={`¿Qué es ${el.name}?`}
                            onClick={() => openElementSci(matId)}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 bg-white text-[11px] font-bold text-stone-500 shadow hover:bg-lime-50 hover:text-lime-700"
                          >
                            ?
                          </button>
                        )}
                      </div>
                    );
                  })
                : process.pieces?.map((p) => {
                    const crafted = state.crafted.includes(p.id);
                    const used = pieceUsed(p.id);
                    const active = activePlace?.piece === p.id;
                    return (
                      <div key={p.id} className="relative">
                        <button
                          type="button"
                          aria-label={p.name}
                          onPointerDown={(e) => (active ? startDrag(e, p.id) : undefined)}
                          disabled={!active}
                          className={`flex w-20 touch-none flex-col items-center gap-1 rounded-xl border p-2 transition ${
                            active
                              ? "cursor-grab border-lime-500 bg-lime-50 shadow ring-2 ring-lime-300"
                              : used || !crafted
                                ? "border-stone-200 bg-stone-100 opacity-30"
                                : "border-stone-200 bg-stone-50 opacity-60"
                          }`}
                        >
                          <span className="flex h-9 w-9 items-center justify-center">
                            <PieceThumb pieceId={p.id} fallback={emojiOf(p.fromElement)} />
                          </span>
                          <span className="text-[10px] font-medium text-stone-600">{p.name}</span>
                        </button>
                        {(p.science || p.fromElement) && (
                          <button
                            type="button"
                            aria-label={`¿Qué es ${p.name}?`}
                            onClick={() => openPieceSci(p)}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 bg-white text-[11px] font-bold text-stone-500 shadow hover:bg-lime-50 hover:text-lime-700"
                          >
                            ?
                          </button>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* ---------------- Panel de pasos ---------------- */}
        <aside className="w-full shrink-0 rounded-2xl border border-stone-200 bg-white p-2 lg:w-80">
          <ol>
            {process.steps.map((s, i) => {
              const stepDone = i < state.stepIndex;
              const active = i === state.stepIndex && !state.done;
              return (
                <li
                  key={s.id}
                  className={`flex gap-3 rounded-xl p-3 ${active ? "bg-lime-50 ring-1 ring-lime-200" : ""} ${
                    i > 0 ? "border-t border-stone-100" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs ${
                      stepDone
                        ? "border-lime-500 bg-lime-500 text-white"
                        : active
                          ? "border-lime-500 text-lime-700"
                          : "border-stone-300 text-stone-400"
                    }`}
                  >
                    {stepDone ? "✓" : i + 1}
                  </span>
                  <div className={stepDone ? "opacity-60" : active ? "" : "opacity-70"}>
                    <p
                      className={`text-sm font-semibold text-stone-800 ${
                        stepDone ? "line-through decoration-stone-400" : ""
                      }`}
                    >
                      {s.instruction ?? s.action}
                    </p>
                    {active && s.note && <p className="mt-1 text-xs text-stone-500">{s.note}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* pieza/material "volando" durante el drag */}
        {drag && (
          <div
            className="pointer-events-none fixed z-50 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-amber-500 bg-white text-2xl shadow-xl"
            style={{ left: drag.x, top: drag.y }}
          >
            {activeCraft ? (
              emojiOf(drag.id)
            ) : (
              <PieceThumb pieceId={drag.id} fallback={emojiOf(pieceById(drag.id)?.fromElement)} className="h-8 w-8" />
            )}
          </div>
        )}

        {/* panel científico (no-modal) */}
        {sci && <SciencePanel subject={sci.subject} madeFrom={sci.madeFrom} onClose={() => setSci(null)} />}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState, type DragEvent } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  applyNodeChanges,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { elementsById, processes } from "@/content";
import { tryAction, type StepInputs } from "@/game/engine";
import type { ConditionType } from "@/game/types";
import { useGameStore } from "@/game/store";
import { DND_MIME, ElementPalette } from "./ElementPalette";
import { ElementNode, type ElementFlowNode } from "./ElementNode";
import { HoldMiniGame } from "./HoldMiniGame";

const nodeTypes: NodeTypes = { element: ElementNode };

// Condiciones "manuales" que se asumen bien hechas al ejecutar la acción.
const MANUAL_INPUTS = { sequedad: 1, torsion: 1, proporcion: 1 } as const;

// Condiciones que requieren una mini-interacción (mantener presionado).
const GAMEPLAY_CONDS: ConditionType[] = ["friccion", "oxigeno", "temperatura"];

const ALL_ACTIONS = Array.from(
  new Set(processes.flatMap((p) => p.steps.map((s) => s.action))),
);

let nodeSeq = 0;
const nextNodeId = () => `n_${nodeSeq++}`;

type Feedback = { kind: "success" | "warn" | "info"; text: string };
type MiniGame = {
  action: string;
  elementIds: string[];
  condType: ConditionType;
  threshold: number;
};

function makeNode(
  elementId: string,
  position: { x: number; y: number },
): ElementFlowNode {
  const el = elementsById[elementId];
  return {
    id: nextNodeId(),
    type: "element",
    position,
    data: { elementId: el.id, emoji: el.emoji, name: el.name },
  };
}

function Canvas() {
  const [nodes, setNodes] = useState<ElementFlowNode[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const discover = useGameStore((s) => s.discover);

  const onNodesChange = useCallback(
    (changes: NodeChange<ElementFlowNode>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const elementId = event.dataTransfer.getData(DND_MIME);
      if (!elementsById[elementId]) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setNodes((nds) => [...nds, makeNode(elementId, position)]);
    },
    [screenToFlowPosition],
  );

  const produce = (producedId: string) => {
    setNodes((nds) => {
      const selected = nds.filter((n) => n.selected);
      const anchor = selected[0]?.position ?? { x: 0, y: 0 };
      return [
        ...nds.filter((n) => !n.selected),
        makeNode(producedId, { x: anchor.x + 40, y: anchor.y + 90 }),
      ];
    });
    discover(producedId);
    setFeedback({ kind: "success", text: `¡${elementsById[producedId].name}! 🎉` });
  };

  const executeWith = (action: string, elementIds: string[], extra: StepInputs) => {
    const res = tryAction(processes, action, elementIds, { ...MANUAL_INPUTS, ...extra });
    if (!res.matched) {
      setFeedback({ kind: "info", text: `Con eso no se puede “${action}”.` });
      return;
    }
    if (!res.ok || !res.produced) {
      setFeedback({ kind: "warn", text: res.hint ?? "No funcionó." });
      return;
    }
    produce(res.produced);
  };

  const runActionOn = (action: string) => {
    const selected = nodes.filter((n) => n.selected);
    if (selected.length === 0) {
      setFeedback({
        kind: "info",
        text: "Seleccioná materiales primero (clic en un nodo; shift+clic para varios).",
      });
      return;
    }
    const elementIds = selected.map((n) => n.data.elementId);
    const probe = tryAction(processes, action, elementIds, MANUAL_INPUTS);
    if (!probe.matched || !probe.step) {
      setFeedback({
        kind: "info",
        text: `Con eso no se puede “${action}”. Probá otra combinación.`,
      });
      return;
    }
    const gameplay = probe.step.conditions.find((c) => GAMEPLAY_CONDS.includes(c.type));
    if (gameplay) {
      setMiniGame({ action, elementIds, condType: gameplay.type, threshold: gameplay.param ?? 1 });
      return;
    }
    executeWith(action, elementIds, {});
  };

  const onMiniComplete = (value: number) => {
    if (!miniGame) return;
    const { action, elementIds, condType } = miniGame;
    setMiniGame(null);
    executeWith(action, elementIds, { [condType]: value });
  };

  return (
    <div className="flex h-screen w-full">
      <ElementPalette />
      <div className="relative flex-1" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <ActionBar actions={ALL_ACTIONS} onAction={runActionOn} feedback={feedback} />
        {miniGame && (
          <HoldMiniGame
            verb={miniGame.action}
            threshold={miniGame.threshold}
            onComplete={onMiniComplete}
            onCancel={() => setMiniGame(null)}
          />
        )}
      </div>
    </div>
  );
}

function ActionBar({
  actions,
  onAction,
  feedback,
}: {
  actions: string[];
  onAction: (action: string) => void;
  feedback: Feedback | null;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4">
      {feedback && (
        <div
          className={`pointer-events-auto rounded-md px-3 py-1.5 text-sm text-white shadow ${
            feedback.kind === "success"
              ? "bg-green-600"
              : feedback.kind === "warn"
                ? "bg-amber-500"
                : "bg-zinc-800"
          }`}
        >
          {feedback.text}
        </div>
      )}
      <div className="pointer-events-auto flex gap-1 rounded-full border border-black/10 bg-white/90 p-1.5 shadow-lg backdrop-blur">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onAction(a)}
            className="rounded-full px-3 py-1.5 text-sm font-medium capitalize hover:bg-zinc-100"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Canvas del juego: arrastrá materiales, seleccionalos y aplicá una acción. */
export function GameCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}

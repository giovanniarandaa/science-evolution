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
import { tryAction } from "@/game/engine";
import { useGameStore } from "@/game/store";
import { DND_MIME, ElementPalette } from "./ElementPalette";
import { ElementNode, type ElementFlowNode } from "./ElementNode";

const nodeTypes: NodeTypes = { element: ElementNode };

// En T7 las condiciones "manuales" (torsión, sequedad) se asumen bien hechas.
// Las de gameplay (fricción, oxígeno) requieren su mini-interacción → T8:
// por eso NO se incluyen aquí y esos pasos fallan con su hint.
const MANUAL_INPUTS = { sequedad: 1, torsion: 1, proporcion: 1 } as const;

const ALL_ACTIONS = Array.from(
  new Set(processes.flatMap((p) => p.steps.map((s) => s.action))),
);

let nodeSeq = 0;
const nextNodeId = () => `n_${nodeSeq++}`;

type Feedback = { kind: "success" | "warn" | "info"; text: string };

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

  const runActionOn = useCallback(
    (action: string) => {
      const selected = nodes.filter((n) => n.selected);
      if (selected.length === 0) {
        setFeedback({
          kind: "info",
          text: "Seleccioná materiales primero (clic en un nodo; shift+clic para varios).",
        });
        return;
      }
      const elementIds = selected.map((n) => n.data.elementId);
      const res = tryAction(processes, action, elementIds, MANUAL_INPUTS);

      if (!res.matched) {
        setFeedback({
          kind: "info",
          text: `Con eso no se puede “${action}”. Probá otra combinación.`,
        });
        return;
      }
      if (!res.ok || !res.produced) {
        setFeedback({ kind: "warn", text: res.hint ?? "No funcionó." });
        return;
      }

      const producedId = res.produced;
      const anchor = selected[0].position;
      setNodes((nds) => [
        ...nds.filter((n) => !n.selected),
        makeNode(producedId, { x: anchor.x + 40, y: anchor.y + 90 }),
      ]);
      discover(producedId);
      setFeedback({ kind: "success", text: `¡${elementsById[producedId].name}! 🎉` });
    },
    [nodes, discover],
  );

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

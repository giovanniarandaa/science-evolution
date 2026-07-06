"use client";

import { useCallback, useState, type DragEvent } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  applyNodeChanges,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { baseElements } from "@/content";
import { DND_MIME, ElementPalette } from "./ElementPalette";

let nodeSeq = 0;
const nextNodeId = () => `n_${nodeSeq++}`;

function Canvas() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
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
      const el = baseElements.find((b) => b.id === elementId);
      if (!el) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setNodes((nds) => [
        ...nds,
        {
          id: nextNodeId(),
          position,
          data: { label: `${el.emoji ?? ""} ${el.name}`.trim() },
        },
      ]);
    },
    [screenToFlowPosition],
  );

  return (
    <div className="flex h-screen w-full">
      <ElementPalette />
      <div className="relative flex-1" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

/** Canvas del juego: arrastrá materiales desde la paleta para crear nodos. */
export function GameCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}

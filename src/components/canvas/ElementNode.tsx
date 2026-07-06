"use client";

import { memo } from "react";
import type { Node, NodeProps } from "@xyflow/react";

export type ElementNodeData = {
  elementId: string;
  emoji?: string;
  name: string;
};

export type ElementFlowNode = Node<ElementNodeData, "element">;

function ElementNodeImpl({ data, selected }: NodeProps<ElementFlowNode>) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors ${
        selected ? "border-blue-500 ring-2 ring-blue-400" : "border-black/15"
      }`}
    >
      <span aria-hidden>{data.emoji}</span>
      <span>{data.name}</span>
    </div>
  );
}

export const ElementNode = memo(ElementNodeImpl);

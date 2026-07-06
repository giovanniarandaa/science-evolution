"use client";

import type { DragEvent } from "react";
import { baseElements } from "@/content";

/** Formato del dato que se transfiere al arrastrar un material al canvas. */
export const DND_MIME = "application/kos-element";

/**
 * Paleta lateral con los materiales base (materia prima recolectable).
 * Cada item se arrastra al canvas para crear un nodo.
 */
export function ElementPalette() {
  const onDragStart = (event: DragEvent<HTMLLIElement>, id: string) => {
    event.dataTransfer.setData(DND_MIME, id);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-48 shrink-0 overflow-y-auto border-r border-black/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-950">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Materiales
      </h2>
      <ul className="flex flex-col gap-2">
        {baseElements.map((el) => (
          <li
            key={el.id}
            draggable
            onDragStart={(e) => onDragStart(e, el.id)}
            data-element-id={el.id}
            className="flex cursor-grab items-center gap-2 rounded-md border border-black/10 bg-white px-2 py-1.5 text-sm shadow-sm select-none active:cursor-grabbing dark:border-white/10 dark:bg-zinc-900"
          >
            <span aria-hidden>{el.emoji}</span>
            <span>{el.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import type { Element, Process } from "@/game/types";
import { edadPiedraElements } from "./elements/edad-piedra";
import { procesoCordeleria } from "./processes/cordeleria";
import { procesoFuego } from "./processes/fuego";

/** Catálogo de todo el contenido del juego (el "árbol de la ciencia"). */
export const elements: Element[] = [...edadPiedraElements];
export const processes: Process[] = [procesoCordeleria, procesoFuego];

/** Índices por id para lookup rápido desde el motor, el store y la UI. */
export const elementsById: Record<string, Element> = Object.fromEntries(
  elements.map((e) => [e.id, e]),
);
export const processesById: Record<string, Process> = Object.fromEntries(
  processes.map((p) => [p.id, p]),
);

/** Ids producidos por algún proceso (intermedios y productos finales). */
const producedIds = new Set<string>();
for (const p of processes) {
  producedIds.add(p.produces);
  for (const s of p.steps) {
    if (s.produces) producedIds.add(s.produces);
  }
}

/** Elementos base: materia prima que ningún proceso produce (recolectable). */
export const baseElements: Element[] = elements.filter((e) => !producedIds.has(e.id));
export const baseElementIds: string[] = baseElements.map((e) => e.id);

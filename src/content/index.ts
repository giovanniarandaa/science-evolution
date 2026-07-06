import type { Element, Process } from "@/game/types";
import { edadPiedraElements } from "./elements/edad-piedra";
import { procesoFuego } from "./processes/fuego";

/** Catálogo de todo el contenido del juego (el "árbol de la ciencia"). */
export const elements: Element[] = [...edadPiedraElements];
export const processes: Process[] = [procesoFuego];

/** Índices por id para lookup rápido desde el motor, el store y la UI. */
export const elementsById: Record<string, Element> = Object.fromEntries(
  elements.map((e) => [e.id, e]),
);
export const processesById: Record<string, Process> = Object.fromEntries(
  processes.map((p) => [p.id, p]),
);

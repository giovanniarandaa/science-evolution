import type { ScienceInfo, Molecule } from "./science";

/** Rol de un elemento dentro del juego. */
export type ElementKind =
  | "material" // materia prima del mundo (madera, piedra, agua)
  | "herramienta" // equipo fabricado (taladro de arco, hacha)
  | "intermedio" // producto a medio proceso (brasa)
  | "energia" // fuente/estado energético (fuego)
  | "producto"; // invento terminado (cerámica)

/**
 * Un elemento/material/producto del mundo: los "nodos" del canvas.
 * Todo lo que el jugador puede tener, arrastrar o combinar.
 */
export interface Element {
  /** Id único, snake_case. Ej: "rama_seca". */
  id: string;
  /** Nombre legible. Ej: "Rama seca". */
  name: string;
  /** Emoji representativo. Ej: "🪵". */
  emoji?: string;
  /** Rol dentro del juego. */
  kind: ElementKind;
  /** Etiquetas para reglas/filtros. Ej: ["seco", "combustible"]. */
  tags?: string[];
  /** Panel "¿qué es esto?". */
  science?: ScienceInfo;
  /** Composición molecular, para el zoom molecular. */
  molecule?: Molecule;
  /** Propiedades numéricas de gameplay. Ej: { temperatura: 600 }. */
  props?: Record<string, number>;
}

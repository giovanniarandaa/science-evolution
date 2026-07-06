import type { ScienceInfo } from "./science";

/**
 * Modelo de la Mesa de Trabajo: cómo cada invento se ARMA pieza por pieza.
 * Es la mecánica central del juego (ver IDEA.md, Pilar 1 — la Mesa de Trabajo).
 *
 * Es puro contenido declarativo: el componente <Mesa> genérico lo renderiza
 * sin conocer ningún invento concreto. Agregar un invento = agregar estos datos
 * + sus assets SVG, no reescribir la Mesa.
 *
 * Dos capas: MATERIALES (se recolectan) → PIEZAS/compuestos (se FABRICAN con un
 * gesto) → ENSAMBLAJE. Las piezas no aparecen "de la nada": se hacen de materiales.
 */

/** Una pieza física que el jugador fabrica, arrastra y ensambla en la mesa. */
export interface Piece {
  /** Id único dentro del invento. Ej: "husillo". */
  id: string;
  /** Nombre legible. Ej: "Husillo". */
  name: string;
  /** Element (material) del que se fabrica esta pieza. Ej: "rama_seca". */
  fromElement?: string;
  /** Referencia al asset SVG que la dibuja (id de <symbol>). Se llena en la sesión de arte. */
  art?: string;
  /** Ciencia propia del compuesto (qué es la pieza ya fabricada, no su material). */
  science?: ScienceInfo;
}

/** Gestos físicos que un paso puede pedir (mapean a una condición del paso). */
export type GestureType =
  | "friccionar"
  | "soplar"
  | "torcer"
  | "enrollar"
  | "tallar"
  | "picar"
  | "amasar"
  | "moler";

/**
 * Cómo se interactúa en un paso de la Mesa:
 * - `craft`: fabricar una `piece` a partir de un `material` con un `gesture`
 *   (tallar la tabla, torcer la cuerda, picar el cojinete…).
 * - `place`: arrastrar una pieza (ya fabricada) hasta un slot de la escena.
 * - `gesture`: ejecutar un gesto físico (cuyo umbral es una condición del paso).
 */
export type StepInteraction =
  | { type: "craft"; piece: string; material: string; gesture: GestureType }
  | { type: "place"; piece: string; slot: string }
  | { type: "gesture"; gesture: GestureType };

/** Posición (y arte) de un slot donde va una pieza en la escena. */
export interface AssemblySlot {
  /** Coordenada X en el sistema del `viewBox` de la escena. */
  x: number;
  /** Coordenada Y en el sistema del `viewBox` de la escena. */
  y: number;
  /** Asset SVG a revelar cuando el slot se llena. */
  art?: string;
}

/** Layout visual del ensamblaje de un invento en la Mesa. */
export interface AssemblyScene {
  /** viewBox de la escena SVG. Ej: "0 0 520 400". */
  viewBox?: string;
  /** Slots nombrados donde se colocan las piezas. */
  slots: Record<string, AssemblySlot>;
}

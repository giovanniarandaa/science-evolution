/**
 * Información científica que acompaña a elementos y procesos.
 * Es el contenido que alimenta el panel "¿qué es esto?" y el zoom molecular.
 */

/** Explicación científica legible de un elemento o invento. */
export interface ScienceInfo {
  /** Qué es, en una frase. Ej: "El fuego es una reacción de oxidación exotérmica." */
  whatIsIt: string;
  /** De qué se compone / cómo funciona. */
  composition: string;
  /** Dato curioso opcional. */
  funFact?: string;
  /** URLs de las fuentes reales usadas (trazabilidad del rigor). */
  sources?: string[];
}

/** Un átomo dentro de una molécula, para el zoom molecular. */
export interface Atom {
  /** Símbolo químico. Ej: "O". */
  symbol: string;
  /** Cantidad de este átomo en la molécula. */
  count: number;
  /** Nombre legible. Ej: "oxígeno". */
  name: string;
}

/** Composición molecular de un elemento, para el zoom molecular. */
export interface Molecule {
  /** Fórmula química. Ej: "(C₆H₁₀O₅)n". */
  formula: string;
  /** Átomos que la componen. */
  atoms: Atom[];
  /** Ecuación de reacción, si aplica. Ej: "celulosa + O₂ → CO₂ + H₂O + calor". */
  reaction?: string;
  /** Descripción legible de la molécula/reacción. */
  description: string;
}

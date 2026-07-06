import type { Molecule, ScienceInfo } from "@/game/types";

/**
 * Datos científicos de la combustión de la madera.
 * Fuentes en `cienciaFuego.sources`. Reutilizados por el elemento y el proceso.
 */

/** Celulosa: el principal componente de la madera. */
export const celulosa: Molecule = {
  formula: "(C₆H₁₀O₅)n",
  atoms: [
    { symbol: "C", count: 6, name: "carbono" },
    { symbol: "H", count: 10, name: "hidrógeno" },
    { symbol: "O", count: 5, name: "oxígeno" },
  ],
  reaction: "celulosa + O₂ → CO₂ + H₂O + calor",
  description:
    "La madera es sobre todo celulosa. Al calentarse (~270-280 °C) se descompone (pirólisis) y sus gases se oxidan con el oxígeno del aire, liberando calor y luz: eso es el fuego.",
};

/** Explicación del fuego para el panel científico. */
export const cienciaFuego: ScienceInfo = {
  whatIsIt: "El fuego es una reacción química de oxidación exotérmica (combustión).",
  composition:
    "Necesita las 3 patas del triángulo del fuego: combustible + oxígeno + calor. La madera no arde directo: primero se descompone por pirólisis (~270-280 °C) y sus gases inflamables se oxidan.",
  funFact:
    "Por eso soplar aviva el fuego: agregás oxígeno, una de las tres patas del triángulo.",
  sources: [
    "https://en.wikipedia.org/wiki/Fire_triangle",
    "https://www.fpl.fs.usda.gov/documnts/pdf2001/white01a.pdf",
  ],
};

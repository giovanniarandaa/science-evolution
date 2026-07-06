import type { Element } from "@/game/types";
import { celulosa, cienciaFuego } from "@/content/science/combustion";

/** Elementos de la Edad de Piedra necesarios para el invento del Fuego. */

const ramaSeca: Element = {
  id: "rama_seca",
  name: "Rama seca",
  emoji: "🪵",
  kind: "material",
  tags: ["seco", "combustible", "madera"],
  science: {
    whatIsIt: "Madera muerta y seca: sobre todo celulosa.",
    composition: "Fibras de celulosa (C₆H₁₀O₅)n. Seca genera calor por fricción; húmeda, no.",
  },
  molecule: celulosa,
};

const fibraSeca: Element = {
  id: "fibra_seca",
  name: "Fibra seca (yesca)",
  emoji: "🌾",
  kind: "material",
  tags: ["seco", "yesca", "combustible"],
  science: {
    whatIsIt: "Material fibroso muerto y muy seco que prende con una brasa.",
    composition: "Fibras vegetales finas con mucha superficie: se encienden fácil.",
  },
};

const cuerda: Element = {
  id: "cuerda",
  name: "Cuerda vegetal",
  emoji: "🪢",
  kind: "material",
  tags: ["fibra"],
  science: {
    whatIsIt: "Fibras torcidas que forman una cuerda resistente.",
    composition: "Fibras vegetales trenzadas; tensan el arco del taladro.",
  },
};

const piedra: Element = {
  id: "piedra",
  name: "Piedra",
  emoji: "🪨",
  kind: "material",
  tags: ["mineral", "dura"],
  science: {
    whatIsIt: "Roca dura, útil como cojinete de apoyo del huso.",
    composition: "Minerales; resiste presión y fricción sin desgastarse rápido.",
  },
};

const taladroArco: Element = {
  id: "taladro_arco",
  name: "Taladro de arco",
  emoji: "🏹",
  kind: "herramienta",
  tags: ["herramienta", "fuego"],
  science: {
    whatIsIt: "Arco + huso + tabla + cojinete para hacer fuego por fricción.",
    composition:
      "Convierte el vaivén del arco en giro rápido del huso, y el giro en calor por fricción.",
  },
};

const brasa: Element = {
  id: "brasa",
  name: "Brasa",
  emoji: "🔴",
  kind: "intermedio",
  tags: ["caliente", "ignicion"],
  science: {
    whatIsIt: "Polvo de madera incandescente: el germen del fuego.",
    composition: "Celulosa parcialmente descompuesta a >280 °C que brilla sin llama.",
    funFact: "Una brasa protegida y bien aireada se convierte en llama.",
  },
  props: { temperatura: 300 },
};

const fuego: Element = {
  id: "fuego",
  name: "Fuego",
  emoji: "🔥",
  kind: "energia",
  tags: ["combustion", "calor", "energia"],
  science: cienciaFuego,
  molecule: celulosa,
  // ~600 °C: suficiente para cocer, pero NO para fundir arena (vidrio) ni metales.
  // Esa carencia motivará inventar el fuelle/horno más adelante.
  props: { temperatura: 600 },
};

export const edadPiedraElements: Element[] = [
  ramaSeca,
  fibraSeca,
  cuerda,
  piedra,
  taladroArco,
  brasa,
  fuego,
];

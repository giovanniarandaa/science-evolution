import type { Process } from "@/game/types";
import { cienciaCuerda } from "@/content/science/cordeleria";

/**
 * Invento previo — La Cordelería (hacer cuerda).
 * La cuerda no es materia prima: se fabrica torciendo fibra vegetal.
 * Habilita el taladro de arco (y por lo tanto el fuego).
 */
export const procesoCordeleria: Process = {
  id: "cordeleria",
  name: "Hacer cuerda (cordelería)",
  era: "piedra",
  produces: "cuerda",
  requires: ["fibra_vegetal"],
  unlocks: ["fuego"],
  steps: [
    {
      id: "torcer",
      action: "torcer",
      description:
        "Torcés dos hebras de fibra y las enrollás en sentido opuesto para que se traben.",
      consumes: ["fibra_vegetal"],
      produces: "cuerda",
      conditions: [
        { type: "torsion", requirement: "Torcer las hebras en sentido opuesto" },
      ],
      failureHint:
        "Sin torsión opuesta las fibras se desenrollan y la cuerda se deshace.",
    },
  ],
  science: cienciaCuerda,
  mission: {
    id: "m_cuerda",
    giver: "Senku",
    goal: "Torcé fibra vegetal para hacer tu primera cuerda.",
    targetProcess: "cordeleria",
  },
};

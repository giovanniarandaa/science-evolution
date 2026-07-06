import type { Process } from "@/game/types";
import { cienciaFuego } from "@/content/science/combustion";

/**
 * Invento #1 — El Fuego (taladro de arco).
 * Modelado como proceso real paso a paso; cada paso puede fallar por una
 * condición física verdadera (madera húmeda, poca fricción, falta de oxígeno).
 */
export const procesoFuego: Process = {
  id: "fuego",
  name: "Encender fuego (taladro de arco)",
  era: "piedra",
  produces: "fuego",
  requires: ["rama_seca", "fibra_seca", "cuerda", "piedra"],
  isKeyElement: true,
  unlocks: ["ceramica", "cal"],
  steps: [
    {
      id: "tallar",
      action: "tallar",
      description:
        "Tallás el huso y la tabla, y armás el arco con la cuerda y el cojinete de piedra.",
      consumes: ["rama_seca", "cuerda", "piedra"],
      produces: "taladro_arco",
      conditions: [{ type: "sequedad", requirement: "La madera debe estar seca" }],
      failureHint: "Madera húmeda: no vas a generar suficiente calor por fricción.",
    },
    {
      id: "friccionar",
      action: "friccionar",
      description:
        "Movés el arco adelante y atrás con ritmo, subiendo velocidad y presión.",
      consumes: ["taladro_arco"],
      produces: "brasa",
      conditions: [
        { type: "friccion", requirement: "Suficiente velocidad y presión", param: 0.8 },
      ],
      failureHint: "Poca fricción: no llegás a ~280 °C y la celulosa no se descompone.",
    },
    {
      id: "soplar",
      action: "soplar",
      description:
        "Pasás la brasa a la yesca y soplás suave y constante para darle oxígeno.",
      consumes: ["brasa", "fibra_seca"],
      produces: "fuego",
      conditions: [{ type: "oxigeno", requirement: "Aportar oxígeno soplando" }],
      failureHint:
        "Sin oxígeno no hay llama: es una de las tres patas del triángulo del fuego.",
    },
  ],
  science: cienciaFuego,
  mission: {
    id: "m_fuego",
    giver: "Senku",
    goal: "Conseguí tu primer fuego para no morir de frío.",
    targetProcess: "fuego",
  },
};

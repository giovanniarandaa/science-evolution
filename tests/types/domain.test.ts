import { describe, it, expect } from "vitest";
import type { Element, Process } from "@/game/types";

// Estos tests validan que el modelo de datos del SPEC §5 compila y admite
// construir contenido tipado. El chequeo real de tipos ocurre en `pnpm typecheck`.

describe("tipos del dominio", () => {
  it("permite construir un Element tipado (con ciencia, molécula y props)", () => {
    const fuego: Element = {
      id: "fuego",
      name: "Fuego",
      emoji: "🔥",
      kind: "energia",
      tags: ["combustion", "calor"],
      props: { temperatura: 600 },
      science: {
        whatIsIt: "El fuego es una reacción química de oxidación exotérmica.",
        composition: "Combustible + oxígeno + calor (triángulo del fuego).",
        sources: ["https://en.wikipedia.org/wiki/Fire_triangle"],
      },
      molecule: {
        formula: "(C₆H₁₀O₅)n",
        atoms: [
          { symbol: "C", count: 6, name: "carbono" },
          { symbol: "H", count: 10, name: "hidrógeno" },
          { symbol: "O", count: 5, name: "oxígeno" },
        ],
        reaction: "celulosa + O₂ → CO₂ + H₂O + calor",
        description: "La celulosa de la madera se oxida y libera energía.",
      },
    };
    expect(fuego.id).toBe("fuego");
    expect(fuego.props?.temperatura).toBe(600);
  });

  it("permite construir un Process tipado con pasos, condiciones y misión", () => {
    const proc: Process = {
      id: "fuego",
      name: "Encender fuego (taladro de arco)",
      era: "piedra",
      produces: "fuego",
      requires: ["rama_seca", "fibra_seca"],
      isKeyElement: true,
      unlocks: ["ceramica", "cal"],
      steps: [
        {
          id: "friccionar",
          action: "friccionar",
          description: "Movés el arco con ritmo, presión y velocidad crecientes.",
          consumes: ["taladro_arco"],
          produces: "brasa",
          conditions: [
            { type: "friccion", requirement: "Suficiente velocidad y presión", param: 0.8 },
          ],
          failureHint: "Poca fricción: no llegás a ~280 °C, la celulosa no se descompone.",
        },
      ],
      science: {
        whatIsIt: "El fuego es una reacción química de oxidación exotérmica.",
        composition: "Necesita las 3 patas del triángulo del fuego.",
      },
      mission: {
        id: "m_fuego",
        giver: "Senku",
        goal: "Conseguí tu primer fuego.",
        targetProcess: "fuego",
      },
    };
    expect(proc.steps).toHaveLength(1);
    expect(proc.steps[0].conditions[0].type).toBe("friccion");
  });
});

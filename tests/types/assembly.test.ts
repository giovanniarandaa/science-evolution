import { describe, it, expect } from "vitest";
import type {
  Piece,
  StepInteraction,
  AssemblyScene,
  Process,
  ProcessStep,
} from "@/game/types";

// RT1 — modelo de datos de la Mesa de Trabajo (mecánica central, ver IDEA.md §Pilar 1).
// El chequeo real de tipos ocurre en `pnpm typecheck`; acá validamos que el modelo
// compila y admite construir el ensamblaje paso a paso.

describe("modelo de la Mesa de Trabajo", () => {
  it("permite construir una Pieza física manipulable", () => {
    const husillo: Piece = {
      id: "husillo",
      name: "Husillo",
      fromElement: "rama_seca",
      art: "husillo",
    };
    expect(husillo.id).toBe("husillo");
    expect(husillo.fromElement).toBe("rama_seca");
  });

  it("modela una interacción 'place' (arrastrar pieza a un slot)", () => {
    const place: StepInteraction = { type: "place", piece: "tabla_fuego", slot: "base" };
    expect(place.type).toBe("place");
    if (place.type === "place") {
      expect(place.piece).toBe("tabla_fuego");
      expect(place.slot).toBe("base");
    }
  });

  it("modela una interacción 'gesture' (gesto físico)", () => {
    const gesture: StepInteraction = { type: "gesture", gesture: "friccionar" };
    expect(gesture.type).toBe("gesture");
    if (gesture.type === "gesture") {
      expect(gesture.gesture).toBe("friccionar");
    }
  });

  it("un ProcessStep admite instrucción, nota e interacción de ensamblaje", () => {
    const step: ProcessStep = {
      id: "colocar_tabla",
      action: "colocar",
      description: "Colocás la tabla de fuego en la mesa.",
      instruction: "Colocá la tabla de fuego",
      note: "Madera blanda y seca: es donde la fricción arranca el polvo caliente.",
      interaction: { type: "place", piece: "tabla_fuego", slot: "base" },
      conditions: [{ type: "sequedad", requirement: "La madera debe estar seca" }],
      failureHint: "Madera húmeda: no vas a generar calor por fricción.",
    };
    expect(step.interaction?.type).toBe("place");
    expect(step.instruction).toMatch(/tabla/i);
  });

  it("una AssemblyScene define slots posicionados para el ensamblaje", () => {
    const scene: AssemblyScene = {
      viewBox: "0 0 520 400",
      slots: {
        base: { x: 262, y: 300, art: "tabla_fuego" },
        husillo: { x: 262, y: 218 },
      },
    };
    expect(scene.slots.base.x).toBe(262);
    expect(Object.keys(scene.slots)).toContain("husillo");
  });

  it("un Process puede llevar piezas y su escena de ensamblaje", () => {
    const proc: Process = {
      id: "fuego",
      name: "Encender fuego (taladro de arco)",
      era: "piedra",
      produces: "fuego",
      requires: ["rama_seca", "cuerda", "piedra"],
      steps: [],
      science: { whatIsIt: "…", composition: "…" },
      pieces: [{ id: "husillo", name: "Husillo", fromElement: "rama_seca" }],
      scene: { slots: { base: { x: 262, y: 300 } } },
    };
    expect(proc.pieces?.[0].id).toBe("husillo");
    expect(proc.scene?.slots.base.y).toBe(300);
  });
});

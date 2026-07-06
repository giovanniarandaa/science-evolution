import { describe, it, expect } from "vitest";
import type { Process } from "@/game/types";
import { tryAction } from "@/game/engine";

const processes: Process[] = [
  {
    id: "demo",
    name: "Demo",
    era: "piedra",
    produces: "cuerda",
    requires: ["fibra"],
    steps: [
      {
        id: "torcer",
        action: "torcer",
        description: "",
        consumes: ["fibra"],
        produces: "cuerda",
        conditions: [{ type: "torsion", requirement: "torcer opuesto" }],
        failureHint: "sin torsión se deshace",
      },
      {
        id: "friccionar",
        action: "friccionar",
        description: "",
        consumes: ["taladro"],
        produces: "brasa",
        conditions: [{ type: "friccion", requirement: "velocidad", param: 0.8 }],
        failureHint: "poca fricción",
      },
      {
        id: "tallar",
        action: "tallar",
        description: "",
        consumes: ["rama", "cuerda", "piedra"],
        produces: "taladro",
        conditions: [{ type: "sequedad", requirement: "seco" }],
        failureHint: "madera húmeda",
      },
    ],
    science: { whatIsIt: "x", composition: "y" },
  },
];

describe("tryAction", () => {
  it("ejecuta el paso cuyo action y consumes coinciden (orden indistinto)", () => {
    const r = tryAction(processes, "tallar", ["cuerda", "piedra", "rama"], {
      sequedad: 1,
    });
    expect(r.matched).toBe(true);
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("taladro");
  });

  it("no coincide si los materiales no matchean ningún paso", () => {
    const r = tryAction(processes, "torcer", ["piedra"], { torsion: 1 });
    expect(r.matched).toBe(false);
    expect(r.ok).toBe(false);
  });

  it("coincide pero falla si no se cumplen las condiciones (devuelve hint)", () => {
    const r = tryAction(processes, "friccionar", ["taladro"], {});
    expect(r.matched).toBe(true);
    expect(r.ok).toBe(false);
    expect(r.hint).toMatch(/fricci/i);
  });
});

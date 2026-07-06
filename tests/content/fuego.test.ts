import { describe, it, expect } from "vitest";
import { elements, processes, elementsById, processesById } from "@/content";
import { runProcess } from "@/game/engine";

describe("integridad del contenido", () => {
  it("todo requires/produces/consumes referencia un Element existente", () => {
    const ids = new Set(elements.map((e) => e.id));
    for (const p of processes) {
      expect(ids.has(p.produces), `produces del proceso: ${p.produces}`).toBe(true);
      for (const r of p.requires) {
        expect(ids.has(r), `requires: ${r}`).toBe(true);
      }
      for (const step of p.steps) {
        for (const c of step.consumes ?? []) {
          expect(ids.has(c), `consumes: ${c}`).toBe(true);
        }
        if (step.produces) {
          expect(ids.has(step.produces), `step.produces: ${step.produces}`).toBe(true);
        }
      }
      if (p.mission) {
        expect(processesById[p.mission.targetProcess]).toBeDefined();
      }
    }
  });

  it("no hay ids de elementos duplicados", () => {
    const ids = elements.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("contenido: el Fuego", () => {
  const fuego = processesById["fuego"];

  it("es un elemento llave que desbloquea cerámica y cal", () => {
    expect(fuego.isKeyElement).toBe(true);
    expect(fuego.unlocks).toEqual(expect.arrayContaining(["ceramica", "cal"]));
  });

  it("el elemento fuego expone su temperatura", () => {
    expect(elementsById["fuego"].props?.temperatura).toBeGreaterThan(0);
  });

  it("tiene ciencia con fuentes citadas (rigor)", () => {
    expect(fuego.science.sources?.length ?? 0).toBeGreaterThan(0);
  });

  it("el motor lo resuelve con éxito y produce fuego", () => {
    const r = runProcess(fuego, {
      tallar: { sequedad: 1 },
      friccionar: { friccion: 1 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("fuego");
  });

  it("falla en friccionar si no hay suficiente fricción, con el hint correcto", () => {
    const r = runProcess(fuego, {
      tallar: { sequedad: 1 },
      friccionar: { friccion: 0.2 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(false);
    expect(r.failedStep?.stepId).toBe("friccionar");
    expect(r.failedStep?.hint).toMatch(/fricci/i);
  });

  it("falla en soplar si no se aporta oxígeno (triángulo del fuego)", () => {
    const r = runProcess(fuego, {
      tallar: { sequedad: 1 },
      friccionar: { friccion: 1 },
      soplar: {},
    });
    expect(r.ok).toBe(false);
    expect(r.failedStep?.stepId).toBe("soplar");
    expect(r.failedStep?.hint).toMatch(/ox[íi]geno/i);
  });
});

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

  // --- integridad del modelo de la Mesa (fabricar + ensamblar) ---
  it("cada paso 'craft'/'place' referencia material/pieza/slot declarados", () => {
    const elemIds = new Set(elements.map((e) => e.id));
    for (const p of processes) {
      const pieceIds = new Set((p.pieces ?? []).map((pc) => pc.id));
      const slotIds = new Set(Object.keys(p.scene?.slots ?? {}));
      for (const step of p.steps) {
        const inter = step.interaction;
        if (inter?.type === "place") {
          expect(pieceIds.has(inter.piece), `${p.id}/${step.id} pieza: ${inter.piece}`).toBe(true);
          expect(slotIds.has(inter.slot), `${p.id}/${step.id} slot: ${inter.slot}`).toBe(true);
        } else if (inter?.type === "craft") {
          expect(pieceIds.has(inter.piece), `${p.id}/${step.id} craft pieza: ${inter.piece}`).toBe(true);
          expect(elemIds.has(inter.material), `${p.id}/${step.id} craft material: ${inter.material}`).toBe(true);
        }
      }
    }
  });

  it("cada pieza con fromElement referencia un Element existente", () => {
    const ids = new Set(elements.map((e) => e.id));
    for (const p of processes) {
      for (const pc of p.pieces ?? []) {
        if (pc.fromElement) {
          expect(ids.has(pc.fromElement), `pieza ${pc.id} fromElement: ${pc.fromElement}`).toBe(true);
        }
      }
    }
  });
});

describe("contenido: el Fuego (fabricar + ensamblar)", () => {
  const fuego = processesById["fuego"];

  it("es un elemento llave que desbloquea cerámica y cal", () => {
    expect(fuego.isKeyElement).toBe(true);
    expect(fuego.unlocks).toEqual(expect.arrayContaining(["ceramica", "cal"]));
  });

  it("se arma en ~13 pasos (fabricar + ensamblar + usar), con instrucción e interacción", () => {
    expect(fuego.steps.length).toBeGreaterThanOrEqual(12);
    expect(fuego.steps.length).toBeLessThanOrEqual(15);
    for (const s of fuego.steps) {
      expect(s.instruction, `paso ${s.id} sin instrucción`).toBeTruthy();
      expect(s.interaction, `paso ${s.id} sin interacción`).toBeDefined();
    }
  });

  it("fabrica cada pieza desde un material (nada aparece de la nada)", () => {
    const craftSteps = fuego.steps.filter((s) => s.interaction?.type === "craft");
    const pieces = fuego.pieces ?? [];
    expect(craftSteps.length).toBe(pieces.length);
    const craftedPieces = new Set(
      craftSteps.map((s) => (s.interaction?.type === "craft" ? s.interaction.piece : "")),
    );
    for (const p of pieces) {
      expect(craftedPieces.has(p.id), `falta fabricar la pieza ${p.id}`).toBe(true);
    }
  });

  it("las piezas son compuestos con ciencia propia", () => {
    for (const p of fuego.pieces ?? []) {
      expect(p.science?.whatIsIt, `pieza ${p.id} sin ciencia`).toBeTruthy();
    }
  });

  it("RIGOR: la piedra se pica para el cojinete y NO se consume en el ensamblaje", () => {
    for (const s of fuego.steps) {
      expect(s.consumes ?? [], `el paso ${s.id} no debe consumir piedra`).not.toContain("piedra");
    }
    const cojinete = (fuego.pieces ?? []).find((p) => p.fromElement === "piedra");
    expect(cojinete, "falta la pieza cojinete derivada de la piedra").toBeDefined();
  });

  it("tiene ciencia con fuentes citadas (rigor)", () => {
    expect(fuego.science.sources?.length ?? 0).toBeGreaterThan(0);
  });

  it("el elemento fuego expone su temperatura", () => {
    expect(elementsById["fuego"].props?.temperatura).toBeGreaterThan(0);
  });

  it("el motor lo resuelve con éxito y produce fuego", () => {
    const r = runProcess(fuego, {
      colocar_tabla: { sequedad: 1 },
      friccionar: { friccion: 1 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("fuego");
  });

  it("falla en friccionar si no hay suficiente fricción, con el hint correcto", () => {
    const r = runProcess(fuego, {
      colocar_tabla: { sequedad: 1 },
      friccionar: { friccion: 0.2 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(false);
    expect(r.failedStep?.stepId).toBe("friccionar");
    expect(r.failedStep?.hint).toMatch(/fricci/i);
  });

  it("falla en soplar si no se aporta oxígeno (triángulo del fuego)", () => {
    const r = runProcess(fuego, {
      colocar_tabla: { sequedad: 1 },
      friccionar: { friccion: 1 },
      soplar: {},
    });
    expect(r.ok).toBe(false);
    expect(r.failedStep?.stepId).toBe("soplar");
    expect(r.failedStep?.hint).toMatch(/ox[íi]geno/i);
  });
});

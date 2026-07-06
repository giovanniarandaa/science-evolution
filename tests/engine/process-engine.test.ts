import { describe, it, expect } from "vitest";
import type { Process, ProcessStep } from "@/game/types";
import { resolveStep, runProcess } from "@/game/engine";

// Fixtures genéricos (NO el contenido real del Fuego): el motor no debe
// conocer ningún invento en particular.

const stepFriccion: ProcessStep = {
  id: "friccionar",
  action: "friccionar",
  description: "Fricción con velocidad y presión.",
  produces: "brasa",
  conditions: [{ type: "friccion", requirement: "velocidad y presión", param: 0.8 }],
  failureHint: "Poca fricción.",
};

const stepSoplar: ProcessStep = {
  id: "soplar",
  action: "soplar",
  description: "Aportar oxígeno soplando.",
  produces: "fuego",
  conditions: [{ type: "oxigeno", requirement: "soplar aire" }],
  failureHint: "Sin oxígeno no hay llama.",
};

const stepLibre: ProcessStep = {
  id: "libre",
  action: "observar",
  description: "Paso sin condiciones.",
  produces: "resultado",
  conditions: [],
  failureHint: "n/a",
};

const proc: Process = {
  id: "demo",
  name: "Proceso demo",
  era: "piedra",
  produces: "fuego",
  requires: [],
  steps: [stepFriccion, stepSoplar],
  science: { whatIsIt: "x", composition: "y" },
};

describe("resolveStep", () => {
  it("tiene éxito y produce su salida cuando el valor supera el umbral", () => {
    const r = resolveStep(stepFriccion, { friccion: 0.9 });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("brasa");
  });

  it("falla con el hint correcto cuando el valor no alcanza el umbral", () => {
    const r = resolveStep(stepFriccion, { friccion: 0.5 });
    expect(r.ok).toBe(false);
    expect(r.hint).toBe("Poca fricción.");
    expect(r.failedCondition?.type).toBe("friccion");
  });

  it("una condición sin param requiere valor >= 1 (booleana)", () => {
    expect(resolveStep(stepSoplar, { oxigeno: 1 }).ok).toBe(true);
    expect(resolveStep(stepSoplar, {}).ok).toBe(false);
  });

  it("un paso sin condiciones siempre tiene éxito", () => {
    expect(resolveStep(stepLibre, {}).ok).toBe(true);
  });
});

describe("runProcess", () => {
  it("produce el elemento del proceso cuando todos los pasos pasan", () => {
    const r = runProcess(proc, {
      friccionar: { friccion: 1 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("fuego");
    expect(r.stepResults).toHaveLength(2);
  });

  it("se detiene y falla en el primer paso que no cumple", () => {
    const r = runProcess(proc, {
      friccionar: { friccion: 0.1 },
      soplar: { oxigeno: 1 },
    });
    expect(r.ok).toBe(false);
    expect(r.produced).toBeUndefined();
    expect(r.failedStep?.stepId).toBe("friccionar");
    expect(r.stepResults).toHaveLength(1);
  });
});

import { describe, it, expect } from "vitest";
import type { ProcessStep } from "@/game/types";
import { resolveAssemblyStep } from "@/game/engine";
import { processesById } from "@/content";

// RT3 — el motor de la Mesa: valida colocar la pieza correcta en el slot correcto
// (place) y resuelve los gestos con umbral (fricción/soplido). Genérico: no conoce
// ningún invento concreto.

const placeStep: ProcessStep = {
  id: "colocar_x",
  action: "colocar",
  description: "",
  instruction: "Colocá X",
  interaction: { type: "place", piece: "pieza_a", slot: "slot_1" },
  conditions: [],
  failureHint: "así no va",
};

const gestureStep: ProcessStep = {
  id: "friccionar_x",
  action: "friccionar",
  description: "",
  instruction: "Frotá",
  interaction: { type: "gesture", gesture: "friccionar" },
  produces: "brasa_x",
  conditions: [{ type: "friccion", requirement: "velocidad y presión", param: 0.8 }],
  failureHint: "poca fricción",
};

const enrollarStep: ProcessStep = {
  id: "enrollar_x",
  action: "enrollar",
  description: "",
  instruction: "Enrollá",
  interaction: { type: "gesture", gesture: "enrollar" },
  conditions: [],
  failureHint: "",
};

describe("resolveAssemblyStep — pasos 'place'", () => {
  it("completa el paso al colocar la pieza correcta en el slot correcto", () => {
    const r = resolveAssemblyStep(placeStep, { kind: "place", piece: "pieza_a", slot: "slot_1" });
    expect(r.ok).toBe(true);
  });

  it("rechaza una pieza equivocada (wrong-piece) con hint", () => {
    const r = resolveAssemblyStep(placeStep, { kind: "place", piece: "pieza_b", slot: "slot_1" });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("wrong-piece");
    expect(r.hint).toBe("así no va");
  });

  it("rechaza el slot equivocado (wrong-slot)", () => {
    const r = resolveAssemblyStep(placeStep, { kind: "place", piece: "pieza_a", slot: "slot_2" });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("wrong-slot");
  });

  it("rechaza un gesto sobre un paso que espera colocar (wrong-interaction)", () => {
    const r = resolveAssemblyStep(placeStep, { kind: "gesture", value: 1 });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("wrong-interaction");
  });
});

describe("resolveAssemblyStep — pasos 'gesture'", () => {
  it("completa y produce si el esfuerzo alcanza el umbral", () => {
    const r = resolveAssemblyStep(gestureStep, { kind: "gesture", value: 1 });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("brasa_x");
  });

  it("falla con hint si el esfuerzo no alcanza el umbral", () => {
    const r = resolveAssemblyStep(gestureStep, { kind: "gesture", value: 0.2 });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("condition");
    expect(r.hint).toMatch(/fricci/i);
  });

  it("un gesto sin condición (enrollar) se completa con solo hacerlo", () => {
    const r = resolveAssemblyStep(enrollarStep, { kind: "gesture" });
    expect(r.ok).toBe(true);
  });
});

describe("resolveAssemblyStep — integración con el Fuego real", () => {
  const fuego = processesById["fuego"];
  const step = (id: string) => {
    const s = fuego.steps.find((x) => x.id === id);
    if (!s) throw new Error(`paso no encontrado: ${id}`);
    return s;
  };

  it("colocar la tabla en la base funciona; la pieza equivocada no", () => {
    const ok = resolveAssemblyStep(step("colocar_tabla"), { kind: "place", piece: "tabla_fuego", slot: "base" });
    expect(ok.ok).toBe(true);
    const bad = resolveAssemblyStep(step("colocar_tabla"), { kind: "place", piece: "husillo", slot: "base" });
    expect(bad.ok).toBe(false);
    expect(bad.reason).toBe("wrong-piece");
  });

  it("colocar el cojinete produce el taladro de arco armado", () => {
    const r = resolveAssemblyStep(step("colocar_cojinete"), {
      kind: "place",
      piece: "cojinete_piedra",
      slot: "cojinete",
    });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("taladro_arco");
  });

  it("friccionar con esfuerzo suficiente produce la brasa; insuficiente, falla", () => {
    const ok = resolveAssemblyStep(step("friccionar"), { kind: "gesture", value: 1 });
    expect(ok.ok).toBe(true);
    expect(ok.produced).toBe("brasa");
    const bad = resolveAssemblyStep(step("friccionar"), { kind: "gesture", value: 0.2 });
    expect(bad.ok).toBe(false);
    expect(bad.reason).toBe("condition");
    expect(bad.hint).toMatch(/fricci/i);
  });
});

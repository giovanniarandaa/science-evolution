import { describe, it, expect } from "vitest";
import { procesoFuego } from "@/content/processes/fuego";
import {
  makeAssemblyReducer,
  initAssembly,
  type AssemblyState,
} from "@/components/mesa/assembly-reducer";
import type { StepAttempt } from "@/game/engine";

const reduce = makeAssemblyReducer(procesoFuego);
const place = (piece: string, slot: string): StepAttempt => ({ kind: "place", piece, slot });
const gesture = (value?: number): StepAttempt => ({ kind: "gesture", value });

function run(attempts: StepAttempt[]): AssemblyState {
  return attempts.reduce(
    (s, a) => reduce(s, { type: "attempt", attempt: a }),
    initAssembly(),
  );
}

// La secuencia correcta para armar el taladro y encender el fuego.
const WIN: StepAttempt[] = [
  place("tabla_fuego", "base"),
  place("husillo", "husillo"),
  place("arco", "arco"),
  place("cuerda_arco", "cuerda"),
  gesture(), // enrollar (sin umbral)
  place("cojinete_piedra", "cojinete"), // → taladro_arco
  gesture(1), // friccionar → brasa
  gesture(1), // soplar → fuego
];

describe("assembly reducer (estado de la Mesa)", () => {
  it("arranca en el primer paso, sin nada colocado", () => {
    const s = initAssembly();
    expect(s.stepIndex).toBe(0);
    expect(s.filledSlots).toHaveLength(0);
    expect(s.done).toBe(false);
  });

  it("colocar la pieza correcta avanza y marca el slot", () => {
    const s = reduce(initAssembly(), { type: "attempt", attempt: place("tabla_fuego", "base") });
    expect(s.stepIndex).toBe(1);
    expect(s.filledSlots).toContain("base");
    expect(s.feedback?.kind).toBe("success");
  });

  it("colocar la pieza equivocada no avanza y da feedback de error", () => {
    const s = reduce(initAssembly(), { type: "attempt", attempt: place("husillo", "base") });
    expect(s.stepIndex).toBe(0);
    expect(s.feedback?.kind).toBe("error");
  });

  it("arma el taladro y enciende el fuego con la secuencia correcta", () => {
    const s = run(WIN);
    expect(s.done).toBe(true);
    expect(s.produced).toEqual(["taladro_arco", "brasa", "fuego"]);
  });

  it("friccionar sin esfuerzo suficiente no avanza (feedback con hint científico)", () => {
    const upToFriccion = run(WIN.slice(0, 6));
    const s = reduce(upToFriccion, { type: "attempt", attempt: gesture(0.2) });
    expect(s.stepIndex).toBe(upToFriccion.stepIndex);
    expect(s.feedback?.kind).toBe("error");
    expect(s.feedback?.text).toMatch(/fricci/i);
  });

  it("reset vuelve al estado inicial", () => {
    const s = run([place("tabla_fuego", "base")]);
    const r = reduce(s, { type: "reset" });
    expect(r.stepIndex).toBe(0);
    expect(r.filledSlots).toHaveLength(0);
  });
});

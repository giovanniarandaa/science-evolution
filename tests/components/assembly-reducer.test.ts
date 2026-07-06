import { describe, it, expect } from "vitest";
import { procesoFuego } from "@/content/processes/fuego";
import {
  makeAssemblyReducer,
  initAssembly,
  type AssemblyState,
} from "@/components/mesa/assembly-reducer";
import type { StepAttempt } from "@/game/engine";

const reduce = makeAssemblyReducer(procesoFuego);
const craft = (material: string, value?: number): StepAttempt => ({ kind: "craft", material, value });
const place = (piece: string, slot: string): StepAttempt => ({ kind: "place", piece, slot });
const gesture = (value?: number): StepAttempt => ({ kind: "gesture", value });

function run(attempts: StepAttempt[]): AssemblyState {
  return attempts.reduce(
    (s, a) => reduce(s, { type: "attempt", attempt: a }),
    initAssembly(),
  );
}

// La secuencia correcta: fabricar 5 piezas → ensamblar → usar.
const WIN: StepAttempt[] = [
  craft("rama_seca"), // tallar_tabla
  craft("rama_seca"), // tallar_husillo
  craft("rama_seca"), // tallar_arco
  craft("fibra_vegetal"), // torcer_cuerda
  craft("piedra"), // picar_cojinete
  place("tabla_fuego", "base"),
  place("husillo", "husillo"),
  place("arco", "arco"),
  place("cuerda_arco", "cuerda"),
  gesture(), // enrollar
  place("cojinete_piedra", "cojinete"), // → taladro_arco
  gesture(1), // friccionar → brasa
  gesture(1), // soplar → fuego
];

describe("assembly reducer (estado de la Mesa)", () => {
  it("arranca en el primer paso, sin nada fabricado ni colocado", () => {
    const s = initAssembly();
    expect(s.stepIndex).toBe(0);
    expect(s.crafted).toHaveLength(0);
    expect(s.filledSlots).toHaveLength(0);
    expect(s.done).toBe(false);
  });

  it("fabricar la primera pieza avanza y la registra en 'crafted'", () => {
    const s = reduce(initAssembly(), { type: "attempt", attempt: craft("rama_seca") });
    expect(s.stepIndex).toBe(1);
    expect(s.crafted).toContain("tabla_fuego");
    expect(s.feedback?.kind).toBe("success");
  });

  it("fabricar con el material equivocado no avanza (feedback de error)", () => {
    const s = reduce(initAssembly(), { type: "attempt", attempt: craft("piedra") });
    expect(s.stepIndex).toBe(0);
    expect(s.feedback?.kind).toBe("error");
  });

  it("fabrica las piezas, arma el taladro y enciende el fuego con la secuencia correcta", () => {
    const s = run(WIN);
    expect(s.done).toBe(true);
    expect(s.crafted).toEqual(
      expect.arrayContaining(["tabla_fuego", "husillo", "arco", "cuerda_arco", "cojinete_piedra"]),
    );
    expect(s.produced).toEqual(["taladro_arco", "brasa", "fuego"]);
  });

  it("friccionar sin esfuerzo suficiente no avanza (feedback con hint científico)", () => {
    const upToFriccion = run(WIN.slice(0, 11));
    const s = reduce(upToFriccion, { type: "attempt", attempt: gesture(0.2) });
    expect(s.stepIndex).toBe(upToFriccion.stepIndex);
    expect(s.feedback?.kind).toBe("error");
    expect(s.feedback?.text).toMatch(/fricci/i);
  });

  it("reset vuelve al estado inicial", () => {
    const s = run([craft("rama_seca")]);
    const r = reduce(s, { type: "reset" });
    expect(r.stepIndex).toBe(0);
    expect(r.crafted).toHaveLength(0);
    expect(r.filledSlots).toHaveLength(0);
  });
});

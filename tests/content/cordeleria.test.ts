import { describe, it, expect } from "vitest";
import { processesById, elementsById } from "@/content";
import { runProcess } from "@/game/engine";

describe("contenido: la Cordelería (hacer cuerda)", () => {
  const cordeleria = processesById["cordeleria"];

  it("produce cuerda a partir de fibra vegetal", () => {
    expect(cordeleria.produces).toBe("cuerda");
    expect(cordeleria.requires).toContain("fibra_vegetal");
  });

  it("la cuerda es un producto fabricado, no materia prima", () => {
    expect(elementsById["cuerda"].kind).toBe("producto");
  });

  it("el motor la resuelve con torsión y produce cuerda", () => {
    const r = runProcess(cordeleria, { torcer: { torsion: 1 } });
    expect(r.ok).toBe(true);
    expect(r.produced).toBe("cuerda");
  });

  it("falla si no hay torsión opuesta, con el hint correcto", () => {
    const r = runProcess(cordeleria, { torcer: {} });
    expect(r.ok).toBe(false);
    expect(r.failedStep?.hint).toMatch(/torsi|desarma|desenroll/i);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "@/game/store";

const WIN = {
  tallar: { sequedad: 1 },
  friccionar: { friccion: 1 },
  soplar: { oxigeno: 1 },
};

beforeEach(() => {
  localStorage.clear();
  useGameStore.getState().reset();
});

describe("game store", () => {
  it("arranca con la materia prima base descubierta y sin progreso", () => {
    const s = useGameStore.getState();
    expect(s.discovered).toEqual(
      expect.arrayContaining(["rama_seca", "fibra_seca", "fibra_vegetal", "piedra"]),
    );
    expect(s.discovered).not.toContain("fuego");
    expect(s.discovered).not.toContain("cuerda"); // la cuerda se fabrica (cordelería)
    expect(s.completedProcesses).toHaveLength(0);
  });

  it("al completar el Fuego lo desbloquea y marca la misión completa", () => {
    const result = useGameStore.getState().attemptProcess("fuego", WIN);
    expect(result.ok).toBe(true);
    const s = useGameStore.getState();
    expect(s.discovered).toContain("fuego");
    expect(s.completedProcesses).toContain("fuego");
    expect(s.completedMissions).toContain("m_fuego");
  });

  it("un intento fallido NO modifica el progreso", () => {
    const result = useGameStore.getState().attemptProcess("fuego", { ...WIN, soplar: {} });
    expect(result.ok).toBe(false);
    const s = useGameStore.getState();
    expect(s.discovered).not.toContain("fuego");
    expect(s.completedProcesses).not.toContain("fuego");
  });

  it("persiste el progreso en localStorage", () => {
    useGameStore.getState().attemptProcess("fuego", WIN);
    const raw = localStorage.getItem("kingdom-of-science") ?? "";
    expect(raw).toContain("fuego");
  });

  it("rehidrata el progreso desde localStorage (sobrevive a recargar)", async () => {
    localStorage.setItem(
      "kingdom-of-science",
      JSON.stringify({
        state: {
          discovered: ["rama_seca", "fibra_seca", "cuerda", "piedra", "fuego"],
          completedProcesses: ["fuego"],
          completedMissions: ["m_fuego"],
        },
        version: 0,
      }),
    );
    await useGameStore.persist.rehydrate();
    const s = useGameStore.getState();
    expect(s.completedProcesses).toContain("fuego");
    expect(s.completedMissions).toContain("m_fuego");
  });
});

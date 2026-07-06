import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mesa } from "@/components/mesa/Mesa";
import { procesoFuego } from "@/content/processes/fuego";
import { useGameStore } from "@/game/store";

beforeEach(() => {
  localStorage.clear();
  useGameStore.getState().reset();
});

describe("<Mesa>", () => {
  it("muestra la misión de Senku y el primer paso activo", () => {
    render(<Mesa process={procesoFuego} />);
    expect(screen.getByText(procesoFuego.mission!.goal)).toBeInTheDocument();
    // el primer paso ahora es fabricar: tallar la tabla (aparece en la guía y en el panel)
    expect(screen.getAllByText(/tallá la tabla de fuego/i).length).toBeGreaterThan(0);
  });

  it("arranca en la fase de fabricación, con los materiales en la bandeja", () => {
    render(<Mesa process={procesoFuego} />);
    // materiales (no piezas ya hechas): madera, fibra, piedra. Nombre exacto para no
    // chocar con el botón "?" (¿Qué es …?).
    expect(screen.getByRole("button", { name: /^rama seca$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^fibra vegetal$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^piedra$/i })).toBeInTheDocument();
  });

  it("lista los pasos del ensamblaje en el panel", () => {
    render(<Mesa process={procesoFuego} />);
    expect(screen.getByText(/frotá el arco de lado a lado/i)).toBeInTheDocument();
    expect(screen.getByText(/pasá la brasa a la yesca/i)).toBeInTheDocument();
  });
});

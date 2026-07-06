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

  it("ofrece las piezas en la bandeja (arrastrables)", () => {
    render(<Mesa process={procesoFuego} />);
    for (const p of procesoFuego.pieces ?? []) {
      expect(screen.getByRole("button", { name: p.name })).toBeInTheDocument();
    }
  });

  it("lista los pasos del ensamblaje en el panel", () => {
    render(<Mesa process={procesoFuego} />);
    expect(screen.getByText(/frotá el arco de lado a lado/i)).toBeInTheDocument();
    expect(screen.getByText(/pasá la brasa a la yesca/i)).toBeInTheDocument();
  });
});

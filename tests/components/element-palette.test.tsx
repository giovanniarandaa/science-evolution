import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ElementPalette } from "@/components/canvas/ElementPalette";

describe("ElementPalette", () => {
  it("muestra los materiales base como items arrastrables", () => {
    render(<ElementPalette />);
    for (const name of ["Rama seca", "Fibra seca (yesca)", "Cuerda vegetal", "Piedra"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("no muestra elementos que se craftean (fuego, brasa)", () => {
    render(<ElementPalette />);
    expect(screen.queryByText("Fuego")).not.toBeInTheDocument();
    expect(screen.queryByText("Brasa")).not.toBeInTheDocument();
  });
});

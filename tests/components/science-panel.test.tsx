import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SciencePanel } from "@/components/mesa/SciencePanel";
import { elementsById } from "@/content";

describe("<SciencePanel>", () => {
  it("muestra la ciencia del fuego con su zoom molecular y fuentes citadas", () => {
    render(<SciencePanel element={elementsById["fuego"]} onClose={() => {}} />);
    // qué es / composición
    expect(screen.getByText(/oxidación exotérmica/i)).toBeInTheDocument();
    expect(screen.getByText(/triángulo del fuego/i)).toBeInTheDocument();
    // zoom molecular: fórmula + reacción
    expect(screen.getByText(/zoom molecular/i)).toBeInTheDocument();
    expect(screen.getByText(/C₆H₁₀O₅/)).toBeInTheDocument();
    expect(screen.getByText(/CO₂/)).toBeInTheDocument();
    // fuentes (rigor)
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("para un elemento sin molécula, no muestra el zoom molecular", () => {
    const piedra = elementsById["piedra"];
    render(<SciencePanel element={piedra} onClose={() => {}} />);
    expect(screen.getByText(piedra.science!.whatIsIt)).toBeInTheDocument();
    expect(screen.queryByText(/zoom molecular/i)).not.toBeInTheDocument();
  });

  it("llama a onClose al tocar cerrar", () => {
    const onClose = vi.fn();
    render(<SciencePanel element={elementsById["fuego"]} onClose={onClose} />);
    screen.getByRole("button", { name: /cerrar/i }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

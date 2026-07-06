import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SciencePanel } from "@/components/mesa/SciencePanel";
import { elementsById } from "@/content";
import { procesoFuego } from "@/content/processes/fuego";

describe("<SciencePanel>", () => {
  it("muestra la ciencia del fuego con su zoom molecular y fuentes citadas", () => {
    render(<SciencePanel subject={elementsById["fuego"]} onClose={() => {}} />);
    expect(screen.getByText(/oxidación exotérmica/i)).toBeInTheDocument();
    expect(screen.getByText(/triángulo del fuego/i)).toBeInTheDocument();
    expect(screen.getByText(/zoom molecular/i)).toBeInTheDocument();
    expect(screen.getByText(/C₆H₁₀O₅/)).toBeInTheDocument();
    expect(screen.getByText(/CO₂/)).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("para un elemento sin molécula, no muestra el zoom molecular", () => {
    const piedra = elementsById["piedra"];
    render(<SciencePanel subject={piedra} onClose={() => {}} />);
    expect(screen.getByText(piedra.science!.whatIsIt)).toBeInTheDocument();
    expect(screen.queryByText(/zoom molecular/i)).not.toBeInTheDocument();
  });

  it("una pieza compuesta muestra su ciencia y de qué material está hecha", () => {
    const tabla = procesoFuego.pieces!.find((p) => p.id === "tabla_fuego")!;
    render(
      <SciencePanel
        subject={{ name: tabla.name, science: tabla.science }}
        madeFrom={elementsById["rama_seca"]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText(/tabla de fuego/i)).toBeInTheDocument();
    expect(screen.getByText(/hecho de/i)).toBeInTheDocument();
    expect(screen.getByText(/rama seca/i)).toBeInTheDocument();
    // el zoom molecular del material (celulosa) acompaña la relación
    expect(screen.getByText(/C₆H₁₀O₅/)).toBeInTheDocument();
  });

  it("llama a onClose al tocar cerrar", () => {
    const onClose = vi.fn();
    render(<SciencePanel subject={elementsById["fuego"]} onClose={onClose} />);
    screen.getByRole("button", { name: /cerrar/i }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

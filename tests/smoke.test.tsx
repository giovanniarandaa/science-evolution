import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>Kingdom of Science</h1>;
}

describe("smoke: toolchain de tests", () => {
  it("ejecuta aserciones básicas", () => {
    expect(1 + 1).toBe(2);
  });

  it("renderiza un componente con Testing Library + jsdom", () => {
    render(<Hello />);
    expect(
      screen.getByRole("heading", { name: /kingdom of science/i }),
    ).toBeInTheDocument();
  });
});

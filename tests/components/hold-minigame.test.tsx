import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { HoldMiniGame } from "@/components/canvas/HoldMiniGame";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("HoldMiniGame", () => {
  it("acumula progreso mientras se mantiene presionado y reporta el valor al soltar", () => {
    const onComplete = vi.fn();
    render(
      <HoldMiniGame
        verb="friccionar"
        threshold={0.8}
        onComplete={onComplete}
        onCancel={() => {}}
      />,
    );
    const pad = screen.getByRole("button", { name: /friccionar/i });
    fireEvent.pointerDown(pad);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.pointerUp(pad);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toBeGreaterThan(0);
  });

  it("si se suelta enseguida, el valor es bajo (no alcanza el umbral)", () => {
    const onComplete = vi.fn();
    render(
      <HoldMiniGame
        verb="soplar"
        threshold={1}
        onComplete={onComplete}
        onCancel={() => {}}
      />,
    );
    const pad = screen.getByRole("button", { name: /soplar/i });
    fireEvent.pointerDown(pad);
    fireEvent.pointerUp(pad);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toBeLessThan(1);
  });
});

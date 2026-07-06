import type { Process, ProcessStep } from "@/game/types";
import { resolveStep, type StepInputs } from "./process-engine";

/** Resultado de intentar una acción sobre un conjunto de materiales. */
export interface ActionResult {
  /** ¿Hubo un paso cuyo `action` y `consumes` coinciden con lo seleccionado? */
  matched: boolean;
  /** ¿El paso se resolvió con éxito? */
  ok: boolean;
  /** Elemento producido si tuvo éxito. */
  produced?: string;
  /** Hint científico si coincidió pero falló una condición. */
  hint?: string;
  /** El paso que coincidió. */
  step?: ProcessStep;
  /** Proceso al que pertenece el paso. */
  processId?: string;
}

/** ¿Dos listas de ids son el mismo multiconjunto (orden indistinto)? */
function sameMultiset(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((id, i) => id === sb[i]);
}

/**
 * Busca, entre los procesos dados, el paso cuyo `action` y `consumes` coinciden
 * con los materiales seleccionados, y lo resuelve con los inputs dados.
 * Genérico: recibe los procesos, no los conoce el motor.
 */
export function tryAction(
  processes: Process[],
  action: string,
  elementIds: string[],
  inputs: StepInputs = {},
): ActionResult {
  for (const p of processes) {
    for (const step of p.steps) {
      if (step.action !== action) continue;
      if (!sameMultiset(step.consumes ?? [], elementIds)) continue;
      const res = resolveStep(step, inputs);
      return {
        matched: true,
        ok: res.ok,
        produced: res.produced,
        hint: res.hint,
        step,
        processId: p.id,
      };
    }
  }
  return { matched: false, ok: false };
}

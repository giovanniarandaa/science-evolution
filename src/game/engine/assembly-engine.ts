import type { ProcessStep } from "@/game/types";
import { resolveStep, type StepInputs } from "./process-engine";

/**
 * Motor de la Mesa de Trabajo: resuelve el intento del jugador contra un paso
 * de ensamblaje. Genérico y sin estado (como el resto de `engine/`): no conoce
 * ningún invento concreto, solo el modelo de `@/game/types`.
 */

/** Lo que el jugador hace sobre un paso de la Mesa. */
export type StepAttempt =
  | { kind: "craft"; material: string; value?: number }
  | { kind: "place"; piece: string; slot: string }
  | { kind: "gesture"; value?: number };

/** Por qué un intento no completó el paso. */
export type AssemblyFailReason =
  | "wrong-interaction" // el tipo de acción no corresponde al paso (fabricar vs colocar vs gesto)
  | "wrong-material" // material equivocado al fabricar
  | "wrong-piece" // pieza equivocada
  | "wrong-slot" // slot equivocado
  | "condition"; // material/pieza/gesto correctos pero no se cumplió una condición física

/** Resultado de intentar completar un paso de ensamblaje. */
export interface AssemblyStepResult {
  ok: boolean;
  /** Elemento producido si el paso lo genera (ej. brasa, fuego, taladro armado). */
  produced?: string;
  /** Explicación científica si falló (el `failureHint` del paso). */
  hint?: string;
  /** Motivo del fallo, para dar feedback preciso en la UI. */
  reason?: AssemblyFailReason;
}

/**
 * Resuelve un intento del jugador contra un paso de la Mesa de Trabajo.
 *
 * - `place`: éxito si la pieza y el slot coinciden con los esperados. En modo
 *   guiado las condiciones del paso (ej. sequedad) se dan por cumplidas —elegiste
 *   el material adecuado— y la elección real de material queda para una mecánica futura.
 * - `gesture`: el `value` (0..1, el "esfuerzo" del gesto) alimenta las condiciones
 *   del paso (fricción, oxígeno…). Sin condiciones (ej. enrollar), basta con hacerlo.
 */
export function resolveAssemblyStep(
  step: ProcessStep,
  attempt: StepAttempt,
): AssemblyStepResult {
  const interaction = step.interaction;
  if (!interaction) {
    return { ok: false, reason: "wrong-interaction" };
  }

  if (interaction.type === "craft") {
    if (attempt.kind !== "craft") {
      return { ok: false, reason: "wrong-interaction" };
    }
    if (attempt.material !== interaction.material) {
      return { ok: false, reason: "wrong-material", hint: step.failureHint };
    }
    // El esfuerzo del gesto (value) alimenta las condiciones del paso, si las hay.
    const value = attempt.value ?? 1;
    const inputs: StepInputs = {};
    for (const c of step.conditions ?? []) inputs[c.type] = value;
    const res = resolveStep(step, inputs);
    return res.ok
      ? { ok: true, produced: res.produced }
      : { ok: false, hint: res.hint, reason: "condition" };
  }

  if (interaction.type === "place") {
    if (attempt.kind !== "place") {
      return { ok: false, reason: "wrong-interaction" };
    }
    if (attempt.piece !== interaction.piece) {
      return { ok: false, reason: "wrong-piece", hint: step.failureHint };
    }
    if (attempt.slot !== interaction.slot) {
      return { ok: false, reason: "wrong-slot", hint: step.failureHint };
    }
    // Pieza y slot correctos: las condiciones se dan por cumplidas (modo guiado).
    const inputs: StepInputs = {};
    for (const c of step.conditions ?? []) inputs[c.type] = c.param ?? 1;
    const res = resolveStep(step, inputs);
    return res.ok
      ? { ok: true, produced: res.produced }
      : { ok: false, hint: res.hint, reason: "condition" };
  }

  // interaction.type === "gesture"
  if (attempt.kind !== "gesture") {
    return { ok: false, reason: "wrong-interaction" };
  }
  const value = attempt.value ?? 0;
  const inputs: StepInputs = {};
  for (const c of step.conditions ?? []) inputs[c.type] = value;
  const res = resolveStep(step, inputs);
  return res.ok
    ? { ok: true, produced: res.produced }
    : { ok: false, hint: res.hint, reason: "condition" };
}

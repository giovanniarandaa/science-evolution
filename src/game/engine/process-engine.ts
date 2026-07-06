import type { ConditionType, Process, ProcessStep, StepCondition } from "@/game/types";

/**
 * Motor de procesos: genérico y sin estado. No conoce ningún invento concreto;
 * solo ejecuta las estructuras de datos definidas en `@/game/types`.
 * Este es el principio "el proceso ES el juego" expresado como lógica pura.
 */

/** Valores que el jugador/entorno aporta para evaluar las condiciones de un paso. */
export type StepInputs = Partial<Record<ConditionType, number>>;

/** Resultado de evaluar un único paso. */
export interface StepResult {
  stepId: string;
  ok: boolean;
  /** Elemento producido si el paso tuvo éxito. */
  produced?: string;
  /** Primera condición que no se cumplió, si el paso falló. */
  failedCondition?: StepCondition;
  /** Explicación científica del fallo (el `failureHint` del paso). */
  hint?: string;
}

/** Resultado de ejecutar un proceso completo. */
export interface ProcessResult {
  processId: string;
  ok: boolean;
  /** Elemento producido por el proceso si TODOS los pasos pasaron. */
  produced?: string;
  /** Resultado de cada paso ejecutado (se detiene en el primero que falla). */
  stepResults: StepResult[];
  /** Primer paso que falló, si lo hubo. */
  failedStep?: StepResult;
}

/**
 * Una condición se cumple si el valor aportado alcanza su umbral.
 * Con `param` numérico, el umbral es `param`; sin él, se trata como booleana
 * y exige el valor completo (>= 1).
 */
function meetsCondition(condition: StepCondition, inputs: StepInputs): boolean {
  const value = inputs[condition.type] ?? 0;
  const threshold = condition.param ?? 1;
  return value >= threshold;
}

/** Evalúa un solo paso contra los inputs del jugador. */
export function resolveStep(step: ProcessStep, inputs: StepInputs = {}): StepResult {
  const failedCondition = step.conditions.find((c) => !meetsCondition(c, inputs));
  if (failedCondition) {
    return { stepId: step.id, ok: false, failedCondition, hint: step.failureHint };
  }
  return { stepId: step.id, ok: true, produced: step.produces };
}

/**
 * Ejecuta un proceso paso a paso, en orden. Produce el elemento del proceso
 * solo si todos los pasos tienen éxito; se detiene en el primer fallo.
 */
export function runProcess(
  process: Process,
  inputsByStep: Record<string, StepInputs> = {},
): ProcessResult {
  const stepResults: StepResult[] = [];
  for (const step of process.steps) {
    const result = resolveStep(step, inputsByStep[step.id] ?? {});
    stepResults.push(result);
    if (!result.ok) {
      return { processId: process.id, ok: false, stepResults, failedStep: result };
    }
  }
  return { processId: process.id, ok: true, produced: process.produces, stepResults };
}

import type { Process, ProcessStep } from "@/game/types";
import {
  resolveAssemblyStep,
  type StepAttempt,
  type AssemblyFailReason,
} from "@/game/engine";

/**
 * Estado y lógica de una sesión de armado en la Mesa de Trabajo.
 * Reducer PURO (sin React ni store) para poder testearlo sin UI; el componente
 * <Mesa> lo envuelve en `useReducer` y conecta los `produced` al store.
 */

export interface AssemblyFeedback {
  kind: "success" | "error" | "info";
  text: string;
}

export interface AssemblyState {
  /** Índice del paso activo (== steps.length cuando el invento está terminado). */
  stepIndex: number;
  /** Slots ya colocados, para dibujar la escena. */
  filledSlots: string[];
  /** Elementos producidos, en orden (taladro_arco, brasa, fuego…). */
  produced: string[];
  /** ¿Se completaron todos los pasos? */
  done: boolean;
  /** Último mensaje para el jugador. */
  feedback: AssemblyFeedback | null;
}

export type AssemblyAction =
  | { type: "attempt"; attempt: StepAttempt }
  | { type: "reset" };

export function initAssembly(): AssemblyState {
  return { stepIndex: 0, filledSlots: [], produced: [], done: false, feedback: null };
}

function errorText(reason: AssemblyFailReason | undefined, hint?: string): string {
  if (hint) return hint;
  switch (reason) {
    case "wrong-piece":
      return "Esa pieza no va en este paso.";
    case "wrong-slot":
      return "Ahí no va. Probá el lugar resaltado.";
    case "wrong-interaction":
      return "Este paso pide otra cosa.";
    default:
      return "Así no funciona.";
  }
}

function successText(step: ProcessStep, produced: string | undefined, done: boolean): string {
  if (done) return "¡Fuego! 🔥";
  if (produced) return `¡Listo! (+${produced})`;
  return step.instruction ? `✓ ${step.instruction}` : "✓ Paso completado";
}

/** Crea un reducer ligado a un proceso concreto (cerrado sobre sus pasos). */
export function makeAssemblyReducer(process: Process) {
  return function reduce(state: AssemblyState, action: AssemblyAction): AssemblyState {
    switch (action.type) {
      case "reset":
        return initAssembly();

      case "attempt": {
        if (state.done) return state;
        const step = process.steps[state.stepIndex];
        if (!step) return state;

        const res = resolveAssemblyStep(step, action.attempt);
        if (!res.ok) {
          return { ...state, feedback: { kind: "error", text: errorText(res.reason, res.hint) } };
        }

        const filledSlots =
          step.interaction?.type === "place"
            ? [...state.filledSlots, step.interaction.slot]
            : state.filledSlots;
        const produced = res.produced ? [...state.produced, res.produced] : state.produced;
        const nextIndex = state.stepIndex + 1;
        const done = nextIndex >= process.steps.length;

        return {
          stepIndex: nextIndex,
          filledSlots,
          produced,
          done,
          feedback: { kind: "success", text: successText(step, res.produced, done) },
        };
      }

      default:
        return state;
    }
  };
}

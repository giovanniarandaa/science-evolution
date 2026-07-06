import { create } from "zustand";
import { persist } from "zustand/middleware";
import { elements, processes, processesById } from "@/content";
import { runProcess, type ProcessResult, type StepInputs } from "@/game/engine";

/**
 * Estado del juego, persistido en localStorage.
 * Single-player, client-side: sin backend (ver SPEC §2).
 */

/** Elementos base: los que ningún proceso produce (materia prima recolectable). */
function computeBaseElementIds(): string[] {
  const produced = new Set<string>();
  for (const p of processes) {
    produced.add(p.produces);
    for (const s of p.steps) {
      if (s.produces) produced.add(s.produces);
    }
  }
  return elements.map((e) => e.id).filter((id) => !produced.has(id));
}

const BASE_ELEMENT_IDS = computeBaseElementIds();

/** Progreso inicial fresco (copias nuevas para no compartir referencias). */
function freshProgress() {
  return {
    discovered: [...BASE_ELEMENT_IDS],
    completedProcesses: [] as string[],
    completedMissions: [] as string[],
  };
}

export interface GameState {
  /** Elementos descubiertos/disponibles (arranca con la materia prima base). */
  discovered: string[];
  /** Ids de procesos completados. */
  completedProcesses: string[];
  /** Ids de misiones completadas. */
  completedMissions: string[];
  /** Intenta ejecutar un proceso; si tiene éxito, actualiza el progreso. */
  attemptProcess: (
    processId: string,
    inputsByStep?: Record<string, StepInputs>,
  ) => ProcessResult;
  /** Reinicia el juego al estado inicial. */
  reset: () => void;
}

const addOnce = (list: string[], id: string): string[] =>
  list.includes(id) ? list : [...list, id];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...freshProgress(),

      attemptProcess: (processId, inputsByStep = {}) => {
        const process = processesById[processId];
        if (!process) {
          throw new Error(`Proceso desconocido: ${processId}`);
        }
        const result = runProcess(process, inputsByStep);
        if (result.ok && result.produced) {
          const state = get();
          set({
            discovered: addOnce(state.discovered, result.produced),
            completedProcesses: addOnce(state.completedProcesses, processId),
            completedMissions: process.mission
              ? addOnce(state.completedMissions, process.mission.id)
              : state.completedMissions,
          });
        }
        return result;
      },

      reset: () => set(freshProgress()),
    }),
    {
      name: "kingdom-of-science",
      // Persistimos solo el progreso, no las acciones.
      partialize: (state) => ({
        discovered: state.discovered,
        completedProcesses: state.completedProcesses,
        completedMissions: state.completedMissions,
      }),
    },
  ),
);

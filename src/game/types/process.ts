import type { ScienceInfo } from "./science";

/** Era del árbol tecnológico. Se irá extendiendo (bronce, hierro, …). */
export type Era = "piedra";

/** Tipo de condición física que un paso debe cumplir para tener éxito. */
export type ConditionType =
  | "sequedad"
  | "friccion"
  | "oxigeno"
  | "temperatura"
  | "proporcion";

/**
 * Una condición física real, modelada como gameplay.
 * Si no se cumple, el paso falla y se muestra el `failureHint` del paso.
 */
export interface StepCondition {
  /** Qué se está midiendo. */
  type: ConditionType;
  /** Requisito legible. Ej: "la madera debe estar seca". */
  requirement: string;
  /** Umbral de gameplay opcional (ej. fricción mínima 0..1). */
  param?: number;
}

/**
 * Un paso de un proceso: el corazón del principio "el proceso ES el juego".
 * Consume elementos, produce un intermedio/resultado y puede fallar.
 */
export interface ProcessStep {
  /** Id del paso, único dentro del proceso. Ej: "friccionar". */
  id: string;
  /** Verbo de la acción. Ej: "friccionar", "soplar", "tallar". */
  action: string;
  /** Descripción de qué hace el jugador en este paso. */
  description: string;
  /** Elementos que consume este paso. */
  consumes?: string[];
  /** Elemento intermedio o final que produce. Ej: "brasa". */
  produces?: string;
  /** Condiciones que deben cumplirse para tener éxito. */
  conditions: StepCondition[];
  /** Explicación científica que se muestra si el paso falla. */
  failureHint: string;
}

/** Objetivo con historia estilo Senku que guía por el árbol. */
export interface Mission {
  /** Id único de la misión. */
  id: string;
  /** Quién la da. Ej: "Senku". */
  giver: string;
  /** El objetivo en palabras del mentor. */
  goal: string;
  /** Id del proceso que hay que completar. */
  targetProcess: string;
}

/**
 * Un invento-proceso: la receta paso a paso.
 * Es puro contenido; el motor genérico lo ejecuta sin conocer su semántica.
 */
export interface Process {
  /** Id único, snake_case. Ej: "fuego". */
  id: string;
  /** Nombre legible. Ej: "Encender fuego (taladro de arco)". */
  name: string;
  /** Era del árbol a la que pertenece. */
  era: Era;
  /** Id del Element que produce al completarse. */
  produces: string;
  /** Ids de Element de entrada. */
  requires: string[];
  /** ¿Es un "elemento llave" que desbloquea una rama entera? */
  isKeyElement?: boolean;
  /** Ids de Process que este invento habilita. */
  unlocks?: string[];
  /** Los pasos reales del procedimiento, en orden. */
  steps: ProcessStep[];
  /** Explicación científica del invento. */
  science: ScienceInfo;
  /** Misión asociada, si la hay. */
  mission?: Mission;
}

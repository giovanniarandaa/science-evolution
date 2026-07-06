import type { Process } from "@/game/types";
import { cienciaFuego } from "@/content/science/combustion";

/**
 * Invento #1 — El Fuego (taladro de arco), como Mesa de Trabajo.
 *
 * La herramienta se ARMA pieza por pieza y recién entonces se fricciona
 * (mecánica central; ver IDEA.md §Pilar 1). Sigue el proceso real del
 * *bow drill* (fuentes en `cienciaFuego`): tabla + husillo + arco + cuerda +
 * cojinete de piedra → fricción → brasa → yesca + oxígeno → fuego.
 *
 * Rigor: la **piedra es el cojinete** (va arriba del husillo y NO se consume).
 */
export const procesoFuego: Process = {
  id: "fuego",
  name: "Encender fuego (taladro de arco)",
  era: "piedra",
  produces: "fuego",
  requires: ["rama_seca", "fibra_seca", "cuerda", "piedra"],
  isKeyElement: true,
  unlocks: ["ceramica", "cal"],

  // Piezas físicas que se ensamblan en la mesa. La piedra hace de cojinete: no se gasta.
  pieces: [
    { id: "tabla_fuego", name: "Tabla de fuego", fromElement: "rama_seca", art: "tabla_fuego" },
    { id: "husillo", name: "Husillo", fromElement: "rama_seca", art: "husillo" },
    { id: "arco", name: "Arco", fromElement: "rama_seca", art: "arco" },
    { id: "cuerda_arco", name: "Cuerda del arco", fromElement: "cuerda", art: "cuerda" },
    { id: "cojinete_piedra", name: "Cojinete de piedra", fromElement: "piedra", art: "cojinete_piedra" },
  ],

  // Layout de la escena (vista lateral). Coordenadas en el viewBox de la Mesa.
  scene: {
    viewBox: "0 0 520 400",
    slots: {
      base: { x: 262, y: 300, art: "tabla_fuego" },
      husillo: { x: 262, y: 218 },
      arco: { x: 262, y: 205 },
      cuerda: { x: 262, y: 205 },
      cojinete: { x: 262, y: 126 },
      yesca: { x: 150, y: 306, art: "yesca" },
    },
  },

  steps: [
    {
      id: "colocar_tabla",
      action: "colocar",
      description: "Apoyás la tabla de fuego, de madera blanda y seca, en la mesa.",
      instruction: "Colocá la tabla de fuego",
      note: "Madera blanda y bien seca: es donde la fricción arranca el polvo caliente. Húmeda, no prende.",
      interaction: { type: "place", piece: "tabla_fuego", slot: "base" },
      conditions: [{ type: "sequedad", requirement: "La madera debe estar seca" }],
      failureHint: "Madera húmeda: no vas a generar suficiente calor por fricción.",
    },
    {
      id: "colocar_husillo",
      action: "colocar",
      description: "Parás el husillo (palo recto en punta) sobre la tabla.",
      instruction: "Pará el husillo sobre la tabla",
      note: "Husillo recto tallado tipo lápiz: la punta de abajo muerde la tabla; la de arriba, redonda, gira suave.",
      interaction: { type: "place", piece: "husillo", slot: "husillo" },
      conditions: [],
      failureHint: "Un husillo torcido no gira parejo y se sale del hoyo.",
    },
    {
      id: "colocar_arco",
      action: "colocar",
      description: "Apoyás el arco: una rama rígida y algo curva.",
      instruction: "Apoyá el arco",
      note: "El arco es una rama rígida y curva; su trabajo es mantener la cuerda tensa.",
      interaction: { type: "place", piece: "arco", slot: "arco" },
      conditions: [],
      failureHint: "Sin un arco firme, la cuerda no queda tensa.",
    },
    {
      id: "tensar_cuerda",
      action: "tensar",
      description: "Atás la cuerda tensa entre las dos puntas del arco.",
      instruction: "Tensá la cuerda en el arco",
      note: "La cuerda que fabricaste (cordelería) se ata tensa entre las puntas del arco.",
      interaction: { type: "place", piece: "cuerda_arco", slot: "cuerda" },
      conditions: [],
      failureHint: "Floja, la cuerda patina y no hace girar el husillo.",
    },
    {
      id: "enrollar",
      action: "enrollar",
      description: "Enrollás la cuerda una vuelta alrededor del husillo.",
      instruction: "Enrollá la cuerda al husillo",
      note: "Una vuelta de cuerda alrededor del husillo convierte el vaivén del arco en giro.",
      interaction: { type: "gesture", gesture: "enrollar" },
      conditions: [],
      failureHint: "Sin la vuelta al husillo, mover el arco no lo hace girar.",
    },
    {
      id: "colocar_cojinete",
      action: "colocar",
      description: "Sostenés el husillo desde arriba con la piedra-cojinete y presionás.",
      instruction: "Sostené con el cojinete de piedra",
      note: "La piedra va ARRIBA del husillo: presionás sin frenar el giro ni quemarte la mano. No se consume: es el apoyo.",
      interaction: { type: "place", piece: "cojinete_piedra", slot: "cojinete" },
      produces: "taladro_arco",
      conditions: [],
      failureHint: "Sin presión desde arriba, el husillo salta y no calienta.",
    },
    {
      id: "friccionar",
      action: "friccionar",
      description: "Movés el arco de lado a lado, largo y parejo, subiendo velocidad.",
      instruction: "Frotá el arco de lado a lado",
      note: "El husillo gira, el polvo se junta en la muesca en V y se calienta hasta ~400 °C: nace la brasa.",
      interaction: { type: "gesture", gesture: "friccionar" },
      consumes: ["taladro_arco"],
      produces: "brasa",
      conditions: [
        { type: "friccion", requirement: "Suficiente velocidad y presión", param: 0.8 },
      ],
      failureHint: "Poca fricción: el polvo no llega a ~400 °C y no se forma la brasa.",
    },
    {
      id: "soplar",
      action: "soplar",
      description: "Pasás la brasa a la yesca y soplás suave y constante.",
      instruction: "Pasá la brasa a la yesca y soplá",
      note: "La brasa cae en el nido de yesca seca; el oxígeno del soplido la convierte en llama.",
      interaction: { type: "gesture", gesture: "soplar" },
      consumes: ["brasa", "fibra_seca"],
      produces: "fuego",
      conditions: [{ type: "oxigeno", requirement: "Aportar oxígeno soplando" }],
      failureHint:
        "Sin oxígeno no hay llama: es una de las tres patas del triángulo del fuego.",
    },
  ],

  science: cienciaFuego,
  mission: {
    id: "m_fuego",
    giver: "Senku",
    goal: "Armá el taladro de arco y conseguí tu primer fuego.",
    targetProcess: "fuego",
  },
};

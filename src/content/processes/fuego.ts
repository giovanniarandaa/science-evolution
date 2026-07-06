import type { Process } from "@/game/types";
import { cienciaFuego } from "@/content/science/combustion";

/**
 * Invento #1 — El Fuego (taladro de arco), como Mesa de Trabajo.
 *
 * Dos capas (ver IDEA.md §Pilar 1):
 *  1. FABRICAR las piezas desde materiales (nada aparece "de la nada"):
 *     madera→tallar→tabla/husillo/arco, fibra→torcer→cuerda, piedra→picar→cojinete.
 *  2. ENSAMBLAR el taladro y usarlo: fricción → brasa → yesca + oxígeno → fuego.
 *
 * Rigor (bow drill real, fuentes en `cienciaFuego`): la piedra se PICA para hacer
 * el cojinete, que va ARRIBA del husillo y NO se consume en el ensamblaje.
 */
export const procesoFuego: Process = {
  id: "fuego",
  name: "Encender fuego (taladro de arco)",
  era: "piedra",
  produces: "fuego",
  requires: ["rama_seca", "fibra_vegetal", "piedra", "fibra_seca"],
  isKeyElement: true,
  unlocks: ["ceramica", "cal"],

  // Piezas (compuestos): cada una se FABRICA de un material y tiene ciencia propia.
  pieces: [
    {
      id: "tabla_fuego",
      name: "Tabla de fuego",
      fromElement: "rama_seca",
      art: "tabla_fuego",
      science: {
        whatIsIt: "Tabla plana de madera blanda y seca, con una muesca en V.",
        composition:
          "Madera (celulosa) tallada. Es la base donde el husillo genera el polvo caliente que se junta en la muesca.",
      },
    },
    {
      id: "husillo",
      name: "Husillo",
      fromElement: "rama_seca",
      art: "husillo",
      science: {
        whatIsIt: "Vara recta de madera tallada en punta, tipo lápiz.",
        composition:
          "Madera seca. La punta de abajo muerde la tabla; al girar rápido, la fricción sube la temperatura hasta ~400 °C.",
      },
    },
    {
      id: "arco",
      name: "Arco",
      fromElement: "rama_seca",
      art: "arco",
      science: {
        whatIsIt: "Rama rígida y algo curva.",
        composition:
          "Madera resistente; mantiene la cuerda tensa para convertir tu vaivén en giro del husillo.",
      },
    },
    {
      id: "cuerda_arco",
      name: "Cuerda del arco",
      fromElement: "fibra_vegetal",
      art: "cuerda",
      science: {
        whatIsIt: "Cordel de fibras vegetales torcidas (cordelería).",
        composition:
          "Dos hebras torcidas en sentido opuesto se traban por fricción y no se desenrollan; transmiten el giro al husillo.",
      },
    },
    {
      id: "cojinete_piedra",
      name: "Cojinete de piedra",
      fromElement: "piedra",
      art: "cojinete_piedra",
      science: {
        whatIsIt: "Piedra dura con un hueco, que va ARRIBA del husillo.",
        composition:
          "Roca; sostiene y presiona el husillo desde arriba sin frenar el giro ni quemarte la mano. No se consume: es el apoyo.",
      },
    },
  ],

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
    // --- FABRICAR las piezas ---
    {
      id: "tallar_tabla",
      action: "tallar",
      description: "Tallás una tabla plana de madera seca y le hacés una muesca en V.",
      instruction: "Tallá la tabla de fuego",
      note: "De madera blanda y bien seca: es donde la fricción va a arrancar el polvo caliente.",
      interaction: { type: "craft", piece: "tabla_fuego", material: "rama_seca", gesture: "tallar" },
      conditions: [],
      failureHint: "La tabla se talla de madera seca.",
    },
    {
      id: "tallar_husillo",
      action: "tallar",
      description: "Tallás una vara recta de madera y le sacás punta.",
      instruction: "Tallá el husillo",
      note: "Recto y en punta tipo lápiz: gira contra la tabla y convierte el giro en calor.",
      interaction: { type: "craft", piece: "husillo", material: "rama_seca", gesture: "tallar" },
      conditions: [],
      failureHint: "El husillo se talla de madera seca.",
    },
    {
      id: "tallar_arco",
      action: "tallar",
      description: "Conseguís una rama rígida y algo curva para el arco.",
      instruction: "Prepará el arco",
      note: "Una rama firme y curva: su trabajo es mantener la cuerda bien tensa.",
      interaction: { type: "craft", piece: "arco", material: "rama_seca", gesture: "tallar" },
      conditions: [],
      failureHint: "El arco es una rama de madera.",
    },
    {
      id: "torcer_cuerda",
      action: "torcer",
      description: "Torcés fibras vegetales en sentido opuesto para hacer la cuerda.",
      instruction: "Torcé la cuerda (fibra)",
      note: "Es la cordelería: dos hebras torcidas al revés se traban por fricción y aguantan la tensión.",
      interaction: { type: "craft", piece: "cuerda_arco", material: "fibra_vegetal", gesture: "torcer" },
      conditions: [],
      failureHint: "La cuerda se hace torciendo fibra vegetal.",
    },
    {
      id: "picar_cojinete",
      action: "picar",
      description: "Picás un hueco en una piedra dura para usarla de cojinete.",
      instruction: "Picá el cojinete (piedra)",
      note: "Una piedra con un hueco: sostiene el husillo desde arriba sin frenarlo. No se gasta.",
      interaction: { type: "craft", piece: "cojinete_piedra", material: "piedra", gesture: "picar" },
      conditions: [],
      failureHint: "El cojinete se pica de una piedra.",
    },

    // --- ENSAMBLAR el taladro ---
    {
      id: "colocar_tabla",
      action: "colocar",
      description: "Apoyás la tabla de fuego en la mesa.",
      instruction: "Colocá la tabla de fuego",
      note: "Bien seca: húmeda, la fricción no llega a la temperatura de la brasa.",
      interaction: { type: "place", piece: "tabla_fuego", slot: "base" },
      conditions: [{ type: "sequedad", requirement: "La madera debe estar seca" }],
      failureHint: "Madera húmeda: no vas a generar suficiente calor por fricción.",
    },
    {
      id: "colocar_husillo",
      action: "colocar",
      description: "Parás el husillo sobre la tabla.",
      instruction: "Pará el husillo sobre la tabla",
      note: "La punta de abajo se apoya en el hoyo de la tabla.",
      interaction: { type: "place", piece: "husillo", slot: "husillo" },
      conditions: [],
      failureHint: "Un husillo torcido no gira parejo y se sale del hoyo.",
    },
    {
      id: "colocar_arco",
      action: "colocar",
      description: "Apoyás el arco cruzando el husillo.",
      instruction: "Apoyá el arco",
      note: "El arco va horizontal, cruzando el husillo.",
      interaction: { type: "place", piece: "arco", slot: "arco" },
      conditions: [],
      failureHint: "Sin un arco firme, la cuerda no queda tensa.",
    },
    {
      id: "tensar_cuerda",
      action: "tensar",
      description: "Atás la cuerda tensa entre las dos puntas del arco.",
      instruction: "Tensá la cuerda en el arco",
      note: "Tensa entre las puntas del arco; floja, patina y no hace girar el husillo.",
      interaction: { type: "place", piece: "cuerda_arco", slot: "cuerda" },
      conditions: [],
      failureHint: "Floja, la cuerda patina y no hace girar el husillo.",
    },
    {
      id: "enrollar",
      action: "enrollar",
      description: "Enrollás la cuerda una vuelta alrededor del husillo.",
      instruction: "Enrollá la cuerda al husillo",
      note: "Una vuelta convierte el vaivén del arco en giro del husillo.",
      interaction: { type: "gesture", gesture: "enrollar" },
      conditions: [],
      failureHint: "Sin la vuelta al husillo, mover el arco no lo hace girar.",
    },
    {
      id: "colocar_cojinete",
      action: "colocar",
      description: "Sostenés el husillo desde arriba con la piedra-cojinete y presionás.",
      instruction: "Sostené con el cojinete de piedra",
      note: "La piedra va ARRIBA: presionás sin frenar el giro ni quemarte. No se consume: es el apoyo.",
      interaction: { type: "place", piece: "cojinete_piedra", slot: "cojinete" },
      produces: "taladro_arco",
      conditions: [],
      failureHint: "Sin presión desde arriba, el husillo salta y no calienta.",
    },

    // --- USAR el taladro ---
    {
      id: "friccionar",
      action: "friccionar",
      description: "Movés el arco de lado a lado, largo y parejo, subiendo velocidad.",
      instruction: "Frotá el arco de lado a lado",
      note: "El husillo gira, el polvo se junta en la muesca y se calienta hasta ~400 °C: nace la brasa.",
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
    goal: "Fabricá las piezas, armá el taladro de arco y conseguí tu primer fuego.",
    targetProcess: "fuego",
  },
};

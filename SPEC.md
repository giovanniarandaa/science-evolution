# Spec: Kingdom of Science — Fundación + Primer Invento (El Fuego)

> Documento vivo. Fuente de verdad técnica del proyecto. Ver visión en `IDEA.md`.
> Este spec cubre: **(A)** la fundación del proyecto (stack, estructura, modelo de datos, estilo, testing, boundaries) y **(B)** el alcance del primer feature a construir: el invento **Fuego**.

---

## 1. Objective

**Qué construimos:** *Kingdom of Science*, un juego web educativo estilo *Dr. Stone* donde el jugador **reconstruye la civilización redescubriendo la ciencia**, construyendo un grafo de procesos en un canvas interactivo (drag & drop).

**Principio central (innegociable):** *el proceso ES el juego.* Cada invento es un **procedimiento paso a paso con condiciones físicas reales que se pueden fallar** — nada de "¡buala, desbloqueaste fuego!".

**Usuario:** público de todas las edades (y el propio dev). **Éxito =** enseña ciencia **real** (qué es / cómo se compone) *y* se siente satisfactorio de armar.

**Alcance de ESTE spec — el invento Fuego:**
Modelar el encendido de fuego por **taladro de arco** (*bow drill*) como un proceso completo en el canvas, con:
- Pasos reales que fallan bajo condiciones reales (madera húmeda, fricción insuficiente, falta de oxígeno).
- Panel científico ("qué es el fuego": combustión, triángulo del fuego, pirólisis).
- Zoom molecular (celulosa + O₂ → CO₂ + H₂O + calor).
- El fuego resultante guarda una propiedad **temperatura** (setup del gating futuro: cerámica → vidrio necesita más calor → fuelle).
- 1 misión estilo Senku.

**Fuera de alcance en este slice:** capa de humanos/reino (Pilar 2 — entra en el 2º invento, con recolección por zonas), cuentas/login, backend, eras posteriores a la Piedra. Ver `IDEA.md` § Not Doing.

---

## 2. Tech Stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** | Client-side hoy; API routes/Server Actions disponibles cuando lleguen cuentas, sin migrar |
| UI | **React 19 + TypeScript 5** | Tipos estrictos para un dominio que va a crecer mucho |
| Canvas de nodos | **React Flow (`@xyflow/react` 12+)** | Estándar de facto para editores de nodos ("n8n de la ciencia") |
| Estado | **Zustand 5** (+ `persist`) | Estado de juego simple y performante; persiste a localStorage |
| Estilos | **Tailwind CSS 4** | Iteración rápida de UI |
| Contenido | **Data-driven en TS** (`src/content/`) | Agregar inventos = agregar contenido, NO tocar la lógica |
| Persistencia | **localStorage** (vía Zustand persist) | Single-player; sin backend en el MVP |
| Tests | **Vitest** (unit) + **Playwright** (e2e) | Motor de juego testeado a fondo; flujo del Fuego verificado end-to-end |
| Deploy | **Vercel** | 1-click, previews por rama |

**Sin backend ni base de datos en el MVP.** El juego corre 100% en el navegador. Backend = decisión futura (Ask First) cuando existan cuentas/sync.

---

## 3. Commands

Gestor de paquetes: **pnpm** (ver Open Questions si se prefiere npm).

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Servidor de desarrollo (http://localhost:3000)
pnpm build            # Build de producción
pnpm start            # Servir el build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit (chequeo de tipos)
pnpm test             # Tests unitarios (Vitest)
pnpm test:e2e         # Tests end-to-end (Playwright)
```

---

## 4. Project Structure

```
kingdom-of-science/
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx              # Pantalla del juego (monta el canvas)
│   └── globals.css
├── src/
│   ├── components/
│   │   ├── canvas/           # Canvas React Flow, nodos custom, aristas
│   │   ├── panels/           # Panel científico, zoom molecular, inventario, misiones
│   │   └── ui/               # Primitivos de UI
│   ├── game/
│   │   ├── engine/           # Motor: resolución de procesos, validación de condiciones
│   │   ├── store/            # Zustand store (estado + persist a localStorage)
│   │   └── types/            # Tipos del dominio (Element, Process, ProcessStep, Molecule…)
│   ├── content/              # ⭐ EL "árbol de la ciencia" — data-driven
│   │   ├── elements/         # Elementos/materiales (rama-seca, fibra, brasa, fuego…)
│   │   ├── processes/        # Inventos-proceso (fuego.ts, …)
│   │   └── science/          # Textos científicos + datos moleculares
│   └── lib/                  # Utilidades
├── tests/                    # Unit tests (Vitest)
├── e2e/                      # E2E tests (Playwright)
├── public/                   # Assets estáticos
├── IDEA.md                   # Visión (existe)
└── SPEC.md                   # Este archivo
```

**Regla de oro:** la **lógica** (`src/game/`) es genérica; el **contenido** (`src/content/`) es lo que cambia por invento. Un invento nuevo = archivos en `content/`, cero cambios en el motor.

---

## 5. Modelo de datos (el corazón)

Los tipos del dominio viven en `src/game/types/`. Diseñados para que *cualquier* invento se exprese como data.

```ts
// Un elemento/material/producto del mundo
export interface Element {
  id: string;                    // "rama_seca", "brasa", "fuego"
  name: string;                  // "Rama seca"
  emoji?: string;                // "🪵"
  kind: "material" | "herramienta" | "intermedio" | "energia" | "producto";
  tags?: string[];               // ["seco", "combustible", "madera"]
  science?: ScienceInfo;         // panel "qué es esto"
  molecule?: Molecule;           // zoom molecular (si aplica)
  props?: Record<string, number>;// propiedades numéricas, ej. { temperatura: 600 }
}

export interface ScienceInfo {
  whatIsIt: string;              // "El fuego es una reacción química de oxidación…"
  composition: string;          // de qué se compone / cómo funciona
  funFact?: string;
  sources?: string[];           // URLs — trazabilidad del rigor
}

export interface Molecule {
  formula: string;              // "(C₆H₁₀O₅)n"
  atoms: { symbol: string; count: number; name: string }[];
  reaction?: string;            // "celulosa + O₂ → CO₂ + H₂O + calor"
  description: string;
}

// Un invento-proceso: la receta paso a paso
export interface Process {
  id: string;                    // "fuego"
  name: string;                  // "Encender fuego (taladro de arco)"
  era: "piedra";                 // era del árbol
  produces: string;              // Element.id resultante: "fuego"
  requires: string[];           // Element.id de entrada
  isKeyElement?: boolean;        // ¿desbloquea una rama entera?
  unlocks?: string[];           // Process.id que habilita
  steps: ProcessStep[];         // los pasos reales del procedimiento
  science: ScienceInfo;         // explicación del invento
  mission?: Mission;            // objetivo estilo Senku
}

// Un paso del proceso, con condiciones que pueden fallar
export interface ProcessStep {
  id: string;                    // "friccionar"
  action: string;                // verbo: "friccionar", "soplar", "tallar"
  description: string;           // "Movés el arco adelante y atrás…"
  consumes?: string[];          // Element.id que gasta
  produces?: string;            // Element.id intermedio, ej. "brasa"
  conditions: StepCondition[];  // qué debe cumplirse para tener éxito
  failureHint: string;          // explicación científica al fallar
}

// Una condición física real, modelada como gameplay
export interface StepCondition {
  type: "sequedad" | "friccion" | "oxigeno" | "temperatura" | "proporcion";
  requirement: string;          // legible: "la madera debe estar seca"
  param?: number;               // umbral de gameplay (ej. fricción mínima)
}

export interface Mission {
  id: string;
  giver: string;                // "Senku"
  goal: string;                 // "Conseguí tu primer fuego para no morir de frío."
  targetProcess: string;        // Process.id a completar
}
```

**Ejemplo de contenido (esqueleto de `content/processes/fuego.ts`):**

```ts
export const fuego: Process = {
  id: "fuego",
  name: "Encender fuego (taladro de arco)",
  era: "piedra",
  produces: "fuego",
  requires: ["rama_seca", "fibra_seca", "cuerda", "piedra"],
  isKeyElement: true,
  unlocks: ["ceramica", "cal"],
  steps: [
    { id: "tallar", action: "tallar", description: "Formás huso, tabla y muesca en V.",
      consumes: ["rama_seca"], produces: "taladro_arco",
      conditions: [{ type: "sequedad", requirement: "La madera debe estar seca" }],
      failureHint: "Madera húmeda: no vas a generar suficiente calor por fricción." },
    { id: "friccionar", action: "friccionar", description: "Movés el arco con ritmo, presión y velocidad crecientes.",
      consumes: ["taladro_arco"], produces: "brasa",
      conditions: [{ type: "friccion", requirement: "Suficiente velocidad y presión", param: 0.8 }],
      failureHint: "Poca fricción: no llegás a ~280 °C, la celulosa no se descompone." },
    { id: "soplar", action: "soplar", description: "Transferís la brasa a la yesca y soplás suave y constante.",
      consumes: ["brasa", "fibra_seca"], produces: "fuego",
      conditions: [{ type: "oxigeno", requirement: "Aportar oxígeno soplando" }],
      failureHint: "Sin oxígeno no hay llama: es una pata del triángulo del fuego." },
  ],
  science: {
    whatIsIt: "El fuego es una reacción química de oxidación exotérmica (combustión).",
    composition: "Necesita las 3 patas del triángulo del fuego: combustible + oxígeno + calor. La madera primero se descompone por pirólisis (~270-280 °C) liberando gases inflamables.",
    sources: ["https://en.wikipedia.org/wiki/Fire_triangle", "https://www.fpl.fs.usda.gov/documnts/pdf2001/white01a.pdf"],
  },
  mission: { id: "m_fuego", giver: "Senku", goal: "Conseguí tu primer fuego.", targetProcess: "fuego" },
};
```

---

## 6. Code Style

- **TypeScript estricto** (`strict: true`). Tipar el dominio explícitamente; evitar `any`.
- Componentes **funcionales** con hooks. Client Components marcados con `"use client"` (React Flow es client-side).
- **Naming:** `PascalCase` componentes/tipos, `camelCase` funciones/variables, `snake_case` para **ids de contenido** (`rama_seca`).
- **Separación estricta:** la lógica (`game/`) nunca hardcodea contenido; lee de `content/`.
- Ids de contenido en español (dominio del juego); código/comentarios técnicos pueden mezclar, pero consistentes por archivo.
- Comentarios: explican el *porqué* científico cuando un valor viene de la investigación (ej. `// 280 °C: umbral de descomposición de la celulosa`).

---

## 7. Testing Strategy

- **Unit (Vitest) — prioridad máxima:** el motor (`game/engine/`). Testear resolución de procesos y validación de condiciones: ¿un paso falla si la condición no se cumple? ¿el proceso produce el elemento correcto al cumplir todos los pasos? Aquí vive el rigor.
- **Componentes (Vitest + RTL):** nodos custom, panel científico, zoom molecular renderizan la data correcta.
- **E2E (Playwright):** el flujo completo del Fuego — arrastrar materiales, ensamblar el taladro, friccionar, soplar, obtener fuego; y los caminos de **falla** (intentar sin soplar → no hay fuego + hint correcto).
- **Cobertura:** foco en `game/engine/` (objetivo alto). UI: happy path + fallos clave.
- Validación de contenido: un test que verifica que todo `Process.requires`/`produces` referencia `Element.id` existentes (integridad del árbol).

---

## 8. Boundaries

**Always (siempre):**
- **Investigar el proceso real antes de autorar un invento**, con fuentes citadas en `science.sources`. Rigor > velocidad.
- Mantener el contenido **data-driven** (nuevos inventos como data, no como lógica).
- Correr `pnpm typecheck` + `pnpm test` antes de cada commit.
- Modelar condiciones fieles a la ciencia real (temperaturas, oxígeno, proporciones).

**Ask first (preguntar primero):**
- Agregar dependencias nuevas.
- Cambiar el **modelo de datos del dominio** (afecta todo el contenido futuro).
- Introducir backend / base de datos.
- Cambiar el stack o el gestor de paquetes.

**Never (nunca):**
- Inventar procesos científicos falsos o "atajos mágicos" (¡buala!).
- Simplificar un invento al punto de perder el rigor sin aprobación.
- Commitear secretos.
- Borrar tests que fallan sin aprobación.

---

## 9. Success Criteria (del slice del Fuego)

- [ ] Proyecto Next.js + React Flow corriendo en local y en un preview de Vercel.
- [ ] En el canvas, el jugador puede: arrastrar `rama_seca` + `fibra_seca`, tallar/ensamblar el **taladro de arco**, **friccionar** (con feedback de velocidad/presión), obtener **brasa**, y **soplar** para encender el **fuego**.
- [ ] Cada paso puede **fallar** con su `failureHint` científico correcto (madera húmeda / poca fricción / sin oxígeno).
- [ ] **Panel científico** muestra "qué es el fuego" (combustión + triángulo del fuego + pirólisis).
- [ ] **Zoom molecular** muestra la reacción: celulosa (C₆H₁₀O₅)ₙ + O₂ → CO₂ + H₂O + calor.
- [ ] El `fuego` resultante expone su propiedad **temperatura** (visible; base del gating futuro).
- [ ] **1 misión** de Senku que se marca completa al encender el fuego.
- [ ] **Progreso persistido** en localStorage (recargar mantiene el fuego desbloqueado).
- [ ] Test unitario del motor: el proceso Fuego falla/tiene éxito según las condiciones. E2E: flujo feliz + un flujo de falla.

---

## 10. Open Questions

- **Gestor de paquetes:** pnpm (propuesto) vs npm. ¿Preferencia?
- **UX de la fricción:** ¿cómo se siente friccionar? (mantener presionado con barra de progreso, ritmo de clicks, arrastre repetido). Se define en la Fase Plan.
- **Canvas libre vs guiado:** ¿nodos flotantes libres estilo n8n, o slots guiados? (Propuesto: libre con snapping y validación de conexiones.)
- **Dirección de arte:** estilo visual (paleta, tipografía, ilustración de nodos) — merece una sesión de diseño propia (`/plan-design` o `frontend-design`).
- **Humanos en el slice 1:** confirmado que la semilla del Pilar 2 entra en el **2º invento** (recolección por zonas para cerámica/cal), no en el Fuego. ¿De acuerdo?

---

*Próxima compuerta:* revisá y aprobá este spec. Con el OK, paso a **Fase Plan** (`/g-plan`): descomponer en tasks ordenados por dependencia (scaffold del proyecto → tipos → motor → contenido del Fuego → canvas → paneles → tests).
```

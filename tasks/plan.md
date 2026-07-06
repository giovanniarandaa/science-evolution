# Implementation Plan: Kingdom of Science — Invento #1 (El Fuego)

> Fuente: `SPEC.md` (aprobado). Visión: `IDEA.md`. Este plan cubre la fundación del proyecto + el primer invento (Fuego). Modo read-only: NO se escribe código hasta `/g-build`.

## Overview

Levantar el esqueleto de *Kingdom of Science* (Next.js + React Flow + Zustand + Tailwind, client-side, sin backend) y construir el primer invento **Fuego** como un proceso paso a paso (taladro de arco) con condiciones que fallan, panel científico, zoom molecular, misión y persistencia local. El motor es genérico y data-driven: inventos futuros se agregan como contenido en `src/content/`, sin tocar `src/game/`.

## Architecture Decisions

- **Client-side puro, sin backend/BD.** Progreso en localStorage (Zustand `persist`). Backend = futuro (cuentas). *Rationale: juego single-player; el backend estaría ocioso.*
- **Data-driven.** Lógica genérica en `src/game/`; contenido (elementos, procesos, ciencia) en `src/content/`. *Rationale: escalar a "proyecto muy grande" sin reescribir el motor.*
- **App Router con `app/` en raíz + `src/` para el resto** (game/content/components/lib). React Flow y el canvas se montan como Client Components (`"use client"`). *Rationale: matchea la estructura del SPEC y evita problemas de SSR/hidratación con React Flow.*
- **pnpm** como gestor de paquetes.
- **UX de la fricción (MVP):** "mantener presionado con barra de progreso" — la interacción más simple que transmite esfuerzo/velocidad. Iterable después.
- **Canvas libre estilo n8n** con snapping y validación de conexiones (no slots rígidos).

## Grafo de dependencias

```
T1 Scaffold ─┬─ T2 Tipos ─┬─ T3 Motor ──┬─ T5 Store ─────────────┐
             │            └─ T4 Contenido Fuego ─┘                │
             │                                                    │
             └─ T6 Canvas base ─ T7 Nodo+conexión ─ T8 Fricción/Soplar ─ T9 Paneles ─ T10 Misión/Temp ─ T11 E2E ─ T12 Deploy
```
Fundación lógica (T1-T5) primero → verificable con tests sin UI. Luego el slice visual jugable (T6-T8) → ciencia y pulido (T9-T10) → verificación y deploy (T11-T12).

---

## Task List

### Phase 1: Foundation (lógica, testeable sin UI)

## Task 1: Scaffold del proyecto
**Descripción:** Inicializar Next.js (App Router) + TypeScript + Tailwind + ESLint en el repo actual (ya contiene `IDEA.md`, `SPEC.md`, `tasks/`). Instalar `@xyflow/react`, `zustand`. Configurar Vitest + Testing Library y Playwright. Crear el árbol de carpetas del SPEC (`src/game`, `src/content`, `src/components`, `src/lib`, `tests`, `e2e`).
**Criterios de aceptación:**
- [ ] `pnpm dev` levanta en localhost:3000 con una página placeholder.
- [ ] Dependencias instaladas: next, react, @xyflow/react, zustand, tailwind; dev: vitest, @testing-library/react, playwright.
- [ ] Estructura de carpetas del SPEC creada (aunque estén vacías con `.gitkeep`).
**Verificación:**
- [ ] `pnpm build` sin errores.
- [ ] `pnpm typecheck` limpio.
- [ ] `pnpm test` corre (aunque sea 0 tests) y `pnpm test:e2e` reconoce Playwright.
**Dependencias:** Ninguna.
**Archivos:** `package.json`, `next.config.*`, `tsconfig.json`, `tailwind.*`, `vitest.config.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`.
**Scope:** M. *Riesgo: create-next-app en directorio no vacío — resolver conflictos con los archivos existentes.*

## Task 2: Tipos del dominio
**Descripción:** Definir en `src/game/types/` las interfaces del SPEC §5: `Element`, `ScienceInfo`, `Molecule`, `Process`, `ProcessStep`, `StepCondition`, `Mission`.
**Criterios de aceptación:**
- [ ] Todas las interfaces del SPEC §5 existen y se exportan desde un índice.
- [ ] `strict: true`; sin `any`.
**Verificación:**
- [ ] `pnpm typecheck` limpio.
- [ ] Test trivial que importa los tipos y construye un objeto de ejemplo tipado.
**Dependencias:** T1.
**Archivos:** `src/game/types/*.ts`.
**Scope:** S.

## Task 3: Motor de procesos
**Descripción:** En `src/game/engine/`, función pura que dado un `Process`, el estado (inventario/elementos disponibles) y el input de una acción, valida las `conditions` de cada `ProcessStep` y determina éxito/falla del paso (con su `failureHint`) y del proceso completo.
**Criterios de aceptación:**
- [ ] `resolveStep(step, context)` retorna éxito o falla + hint según se cumplan las condiciones.
- [ ] `runProcess(process, context)` encadena los pasos y produce el `Element` resultante solo si todos los pasos tienen éxito.
- [ ] Motor es genérico (no menciona "fuego" ni contenido específico).
**Verificación:**
- [ ] Tests Vitest: paso con condición cumplida → éxito; condición no cumplida → falla + hint correcto; proceso completo → produce elemento.
**Dependencias:** T2.
**Archivos:** `src/game/engine/*.ts`, `tests/engine/*.test.ts`.
**Scope:** M.

## Task 4: Contenido del Fuego
**Descripción:** Autorar en `src/content/` los elementos (`rama_seca`, `fibra_seca`, `cuerda`, `piedra`, `taladro_arco`, `brasa`, `fuego`), el proceso `fuego` (3 pasos: tallar → friccionar → soplar, con condiciones y hints reales), y la ciencia + molécula (celulosa + O₂ → CO₂ + H₂O + calor). Incluir un test de **integridad del contenido**.
**Criterios de aceptación:**
- [ ] `content/processes/fuego.ts` matchea el esqueleto del SPEC (pasos, condiciones, hints, `sources`).
- [ ] `fuego` tiene `isKeyElement: true` y `unlocks: ["ceramica","cal"]` (aunque aún no existan).
- [ ] `fuego` (Element) expone `props.temperatura`.
**Verificación:**
- [ ] Test de integridad: todo `requires`/`produces`/`consumes` referencia un `Element.id` existente.
- [ ] El motor (T3) resuelve el proceso Fuego con este contenido en un test.
**Dependencias:** T2, T3.
**Archivos:** `src/content/elements/*.ts`, `src/content/processes/fuego.ts`, `src/content/science/*.ts`, `tests/content/*.test.ts`.
**Scope:** M.

## Task 5: Store del juego (Zustand + persist)
**Descripción:** En `src/game/store/`, estado del juego (elementos desbloqueados, procesos completados, inventario, misiones) con acciones (intentar paso, completar proceso, desbloquear). Persistir a localStorage con `persist`.
**Criterios de aceptación:**
- [ ] Completar el proceso Fuego marca `fuego` como desbloqueado y la misión como completa.
- [ ] El estado se rehidrata desde localStorage al recargar.
**Verificación:**
- [ ] Tests del store: completar Fuego actualiza estado; serializa/rehidrata correctamente.
**Dependencias:** T3, T4.
**Archivos:** `src/game/store/*.ts`, `tests/store/*.test.ts`.
**Scope:** M.

### ✅ Checkpoint: Foundation (después de T1-T5)
- [ ] `pnpm test` + `pnpm typecheck` + `pnpm build` en verde.
- [ ] El flujo del Fuego funciona **a nivel lógico** (motor + contenido + store), sin UI.
- [ ] **Review con el usuario** antes de seguir al canvas.

---

### Phase 2: Slice jugable (canvas visual)

## Task 6: Canvas base con React Flow
**Descripción:** Montar React Flow en `app/page.tsx` (Client Component) con un inventario/paleta de elementos iniciales arrastrables al canvas. Estilo funcional limpio (el arte fino es sesión aparte).
**Criterios de aceptación:**
- [ ] Se ve el canvas; se pueden arrastrar elementos iniciales (`rama_seca`, `fibra_seca`, `cuerda`, `piedra`) como nodos.
- [ ] Sin errores de hidratación (React Flow como client-only).
**Verificación:**
- [ ] Check manual: arrastrar y soltar nodos funciona; `pnpm build` ok.
**Dependencias:** T1 (usa contenido de T4 para la paleta).
**Archivos:** `app/page.tsx`, `src/components/canvas/*.tsx`.
**Scope:** M. *Riesgo técnico temprano: SSR de React Flow — dynamic import `ssr:false`.*

## Task 7: Nodo custom + conexión que dispara un paso
**Descripción:** Nodo custom de elemento (emoji, nombre) y la interacción de **conectar/combinar** que ejecuta el motor: conectar los inputs correctos dispara el paso y produce el intermedio (ej. tallar → `taladro_arco`).
**Criterios de aceptación:**
- [ ] Conectar `rama_seca`(+piedra/cuerda) y ejecutar "tallar" produce `taladro_arco` como nodo nuevo.
- [ ] Conexiones inválidas se rechazan con feedback.
**Verificación:**
- [ ] Check manual: el primer paso (tallar) funciona end-to-end en el canvas.
**Dependencias:** T5, T6.
**Archivos:** `src/components/canvas/*.tsx`, `src/game/store/*.ts` (glue).
**Scope:** M.

## Task 8: Interacciones de fricción y soplado (+ manejo de falla)
**Descripción:** Las dos acciones con condición de gameplay: **friccionar** (mantener presionado → barra de progreso → `brasa`) y **soplar** (+ aire → `fuego`). Mostrar el `failureHint` cuando una condición no se cumple (ej. soltar sin soplar).
**Criterios de aceptación:**
- [ ] Completar friccionar → brasa; soplar → 🔥 fuego.
- [ ] Saltarse una condición (no soplar / poca fricción) muestra el `failureHint` científico correcto.
**Verificación:**
- [ ] Check manual: flujo feliz enciende el fuego; camino de falla muestra el hint.
**Dependencias:** T7.
**Archivos:** `src/components/canvas/*.tsx`, `src/components/ui/*.tsx`.
**Scope:** M.

### ✅ Checkpoint: Slice jugable (después de T6-T8)
- [ ] Se puede **encender el fuego en el canvas end-to-end** (happy path) y ver un camino de falla con hint.
- [ ] **Review con el usuario.**

---

### Phase 3: Ciencia, misión y pulido

## Task 9: Panel científico + zoom molecular
**Descripción:** Al seleccionar un nodo, panel lateral con `science` (qué es / cómo se compone / fuente). Para nodos con `molecule`, el **zoom molecular** muestra la reacción y los átomos.
**Criterios de aceptación:**
- [ ] Seleccionar `fuego` muestra combustión + triángulo del fuego + pirólisis.
- [ ] Zoom molecular de `fuego`/`madera` muestra celulosa (C₆H₁₀O₅)ₙ + O₂ → CO₂ + H₂O + calor.
**Verificación:**
- [ ] Check manual + test de componente (renderiza la data de `science`/`molecule`).
**Dependencias:** T4, T8.
**Archivos:** `src/components/panels/*.tsx`.
**Scope:** M.

## Task 10: Misión de Senku + temperatura + persistencia visible
**Descripción:** Mostrar la misión activa ("Conseguí tu primer fuego") y marcarla completa al encender. El nodo `fuego` muestra su `props.temperatura`. Verificar que recargar la página mantiene el fuego desbloqueado (persistencia de T5 visible en UI).
**Criterios de aceptación:**
- [ ] La misión aparece y se marca completa al encender el fuego.
- [ ] El nodo `fuego` muestra la temperatura.
- [ ] Recargar mantiene el fuego desbloqueado.
**Verificación:**
- [ ] Check manual: completar misión, ver temperatura, recargar y seguir desbloqueado.
**Dependencias:** T8, (T5).
**Archivos:** `src/components/panels/*.tsx`, `src/components/ui/*.tsx`.
**Scope:** S/M.

### ✅ Checkpoint: Contenido completo (después de T9-T10)
- [ ] Todos los Success Criteria del SPEC §9 cumplidos.
- [ ] **Review con el usuario.**

---

### Phase 4: Verificación y deploy

## Task 11: Tests E2E (Playwright)
**Descripción:** E2E del flujo del Fuego: happy path (arrastrar → tallar → friccionar → soplar → fuego + misión completa) y un camino de falla (sin soplar → hint, sin fuego).
**Criterios de aceptación:**
- [ ] Test happy path pasa.
- [ ] Test de falla pasa (hint visible, fuego no producido).
**Verificación:**
- [ ] `pnpm test:e2e` en verde.
**Dependencias:** T10.
**Archivos:** `e2e/fuego.spec.ts`.
**Scope:** S/M.

## Task 12: Deploy a Vercel (preview)
**Descripción:** Conectar el repo a Vercel y desplegar un preview.
**Criterios de aceptación:**
- [ ] URL de preview carga y el juego del Fuego es jugable.
**Verificación:**
- [ ] Abrir la URL y encender el fuego.
**Dependencias:** T11.
**Archivos:** `vercel.json`/config si hace falta.
**Scope:** S.

### ✅ Checkpoint: Complete
- [ ] Todos los criterios de aceptación cumplidos; E2E en verde; preview desplegado.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| React Flow + SSR de Next → errores de hidratación | Med | Client Component + dynamic import `ssr:false`; se ataca temprano en T6 |
| `create-next-app` en directorio no vacío (IDEA.md/SPEC.md/tasks) | Bajo | Scaffold manejando conflictos o en subdir temporal + merge |
| UX de "friccionar" poco clara/insatisfactoria | Med | MVP con barra de progreso simple; iterar en sesión de UX posterior |
| Modelo de datos insuficiente al llegar inventos más complejos | Med | Es "Ask first" cambiar el modelo; el Fuego lo valida antes de escalar |

## Open Questions

- **Dirección de arte / estilo visual:** el MVP usa un estilo funcional limpio; el diseño distintivo merece una sesión aparte (`frontend-design` / `/plan-design`). ¿Cuándo la agendamos?
- **UX de fricción:** ¿la barra de progreso "mantener presionado" te convence, o preferís otra interacción (ritmo de clicks, arrastre)?

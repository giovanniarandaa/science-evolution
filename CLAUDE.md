# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

**Kingdom of Science** — juego web educativo estilo *Dr. Stone* donde se reconstruye la ciencia invento por invento. Visión y roadmap en `IDEA.md`; pendientes y decisiones en `PENDING.md`; estado y plan en `tasks/todo.md` + `tasks/plan.md`; panorama en `README.md`. **Leé esos al retomar el proyecto.**

## Comandos

```bash
pnpm dev            # dev server en localhost:3000
pnpm build          # build de producción
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm test           # tests unitarios (Vitest, corrida única)
pnpm test <patrón>  # correr un archivo/grupo (ej. pnpm test mesa)
pnpm test:e2e       # E2E (Playwright); un archivo: pnpm test:e2e e2e/fuego.spec.ts
```

Verificación de cada task = `typecheck` + `test` en verde (y `build` en los checkpoints).

## Arquitectura (data-driven)

Regla de oro: **agregar un invento = agregar datos + assets, NO tocar el motor.** Tres capas:

- `src/game/` — **lógica genérica**, agnóstica de la UI: `types/` (modelo de dominio), `engine/` (funciones puras), `store/` (Zustand + persist a `localStorage`).
- `src/content/` — **el contenido** (el "árbol de la ciencia"): `elements/`, `processes/` (los inventos paso a paso), `science/`. Se agregan a los índices en `content/index.ts`.
- `src/components/mesa/` — **presentación**: la Mesa de Trabajo (genérica) + una escena SVG por-invento en `scenes/`.

**Mecánica central — la Mesa de Trabajo:** cada invento se juega en 3 fases — **fabricar** las piezas desde materiales → **ensamblar** la herramienta → **usarla** con gestos físicos. Nada aparece "de la nada".

**Modelo clave** (`src/game/types/`): un `Process` tiene `steps[]`; cada `ProcessStep` lleva una `StepInteraction` discriminada — `craft` (material + gesto → pieza), `place` (pieza → slot) o `gesture` (friccionar/soplar/…). Las `Piece` son **compuestos** (con `fromElement` + ciencia propia); los `Element` son materiales/productos.

**Motores** (`src/game/engine/`): `resolveStep`/`runProcess` evalúan las condiciones de un proceso; `resolveAssemblyStep(step, attempt)` resuelve la acción del jugador en la Mesa (valida material/pieza/slot y el umbral de los gestos). El estado de una sesión de armado es un reducer puro y testeable en `components/mesa/assembly-reducer.ts`.

## Convenciones

- **Idioma: español** en todo — UI, comentarios, docs y mensajes de commit. Mantené las tildes.
- **Investigación primero (innegociable):** antes de construir un invento, investigá cómo se hace *de verdad* (con fuentes citadas, que van en `science`) y si es el *siguiente* invento correcto en el árbol. Dispuestos a dar pasos atrás por rigor.
- **TDD:** test en rojo → implementación en verde. **Un commit por task** (prefijos `feat`/`docs`/`chore`/`test`) y marcá la task en `tasks/todo.md`.
- **Light mode forzado** (`app/globals.css`). Client-side, sin backend.
- Next.js 16 trae breaking changes respecto a lo conocido → ver `AGENTS.md`.

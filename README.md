# 🔥 Kingdom of Science

> Un juego web donde **reconstruís la civilización desde cero** redescubriendo la ciencia, al estilo *Dr. Stone*. Cada invento se **construye paso a paso** —con condiciones físicas reales que se pueden fallar— y te enseña **de qué se compone el mundo**. De frotar dos ramas para hacer fuego… hasta el futuro.

## La idea

El principio central es **"el proceso ES el juego"**: nada de *"¡felicidades, descubriste el fuego!"*. Cada invento es un **procedimiento real** que armás en una **Mesa de Trabajo**:

1. **Recolectás** materiales (madera, fibra, piedra…).
2. **Fabricás** las piezas desde esos materiales (tallás la tabla, torcés la cuerda, picás el cojinete…).
3. **Ensamblás** la herramienta pieza por pieza.
4. **La usás** con gestos físicos (frotás para generar fricción, soplás para dar oxígeno).

Y en cada paso podés abrir la **ciencia real** de lo que tenés en la mano: qué es, cómo se compone, su molécula, con fuentes citadas.

👉 Visión completa y roadmap: [`IDEA.md`](./IDEA.md) · Pendientes y decisiones: [`PENDING.md`](./PENDING.md)

## Estado

**Invento #1 — El Fuego (taladro de arco): completo y jugable.** Se juega de 0 a 🔥 (fabricar → ensamblar → friccionar → soplar), con panel científico y zoom molecular. Verificado con tests unitarios + E2E y desplegado en Vercel.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Zustand** (estado + persistencia en `localStorage`)
- **Tailwind CSS 4** + **SVG** para la Mesa (sin motor de juego externo)
- **Vitest** + Testing Library (unit) · **Playwright** (E2E)
- Client-side puro, sin backend. Deploy en **Vercel**.

## Cómo correr

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Otros comandos:

```bash
pnpm test         # tests unitarios (Vitest)
pnpm test:e2e     # tests end-to-end (Playwright)
pnpm typecheck    # tsc --noEmit
pnpm build        # build de producción
```

## Arquitectura (data-driven)

La lógica es genérica; el contenido son datos. **Agregar un invento = agregar datos + assets, no reescribir el motor.**

```
src/
  game/           # LÓGICA genérica (agnóstica de la UI)
    types/        #   modelo de dominio (Element, Process, Piece, StepInteraction…)
    engine/       #   motor de procesos y de ensamblaje (funciones puras)
    store/        #   estado del juego (Zustand + persist)
  content/        # CONTENIDO (el "árbol de la ciencia")
    elements/     #   materiales y productos
    processes/    #   los inventos, paso a paso
    science/      #   fichas científicas y moléculas
  components/
    mesa/         # PRESENTACIÓN: la Mesa de Trabajo (genérica) + escenas por-invento
app/              # rutas (App Router)
e2e/              # tests Playwright
tests/            # tests unitarios
```

## Cómo se construye

Proyecto de largo aliento, **invento por invento**. Reglas del juego:

- **Investigación primero (innegociable):** antes de construir un invento se investiga cómo se hace *de verdad* (con fuentes). El rigor manda.
- **Dispuestos a dar pasos atrás:** si "así no se hace tal invento", se corrige aunque implique rehacer.
- **TDD:** test en rojo → implementación en verde → un commit por task.

---

*Inspirado en Dr. Stone. Hecho con rigor, paso a paso.* 🧪

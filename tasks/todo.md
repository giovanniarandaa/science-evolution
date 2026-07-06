# TODO: Kingdom of Science — Invento #1 (El Fuego)

Plan completo en `tasks/plan.md`. Implementar con `/g-build` (un task por vez, en orden).

## Phase 1 — Foundation (lógica testeable sin UI)
- [ ] **T1** · Scaffold Next.js + TS + Tailwind + React Flow + Zustand + Vitest/Playwright · _M_
- [ ] **T2** · Tipos del dominio (`src/game/types`) · _S_
- [ ] **T3** · Motor de procesos genérico (`src/game/engine`) + tests · _M_
- [ ] **T4** · Contenido del Fuego (`src/content`) + test de integridad · _M_
- [ ] **T5** · Store Zustand + persist a localStorage + tests · _M_
- [ ] ✅ **Checkpoint Foundation** — tests/typecheck/build en verde; flujo lógico del Fuego OK; review

## Phase 2 — Slice jugable (canvas)
- [ ] **T6** · Canvas base React Flow + paleta de elementos arrastrables · _M_
- [ ] **T7** · Nodo custom + conexión que dispara un paso (tallar → taladro) · _M_
- [ ] **T8** · Interacciones friccionar (→brasa) y soplar (→fuego) + manejo de falla · _M_
- [ ] ✅ **Checkpoint Slice jugable** — encender fuego end-to-end + camino de falla; review

## Phase 3 — Ciencia, misión y pulido
- [ ] **T9** · Panel científico + zoom molecular · _M_
- [ ] **T10** · Misión de Senku + temperatura del fuego + persistencia visible · _S/M_
- [ ] ✅ **Checkpoint Contenido completo** — Success Criteria del SPEC §9; review

## Phase 4 — Verificación y deploy
- [ ] **T11** · Tests E2E Playwright (happy path + falla) · _S/M_
- [ ] **T12** · Deploy a Vercel (preview) · _S_
- [ ] ✅ **Checkpoint Complete** — todo cumplido; E2E verde; preview desplegado

# TODO: Kingdom of Science — Invento #1 (El Fuego)

Plan completo en `tasks/plan.md`. Implementar con `/g-build` (un task por vez, en orden).

## Phase 1 — Foundation (lógica testeable sin UI)
- [x] **T1** · Scaffold Next.js + TS + Tailwind + React Flow + Zustand + Vitest/Playwright · _M_ ✅ `bdbb954`
- [x] **T2** · Tipos del dominio (`src/game/types`) · _S_ ✅ `716d41b`
- [x] **T3** · Motor de procesos genérico (`src/game/engine`) + tests · _M_ ✅ `f982841`
- [x] **T4** · Contenido del Fuego (`src/content`) + test de integridad · _M_ ✅ `ef6690d`
- [x] **T5** · Store Zustand + persist a localStorage + tests · _M_ ✅ `98f73e3`
- [x] ✅ **Checkpoint Foundation** — tests/typecheck/build en verde; flujo lógico del Fuego OK; **review ⇦ ACÁ**

## Phase 2 — Slice jugable (canvas)
- [x] **T6** · Canvas base React Flow + paleta de elementos arrastrables · _M_ ✅ `d18b1c6`
- [x] **T7** · Nodo custom + acción que dispara un paso (torcer → cuerda, tallar → taladro) · _M_ ✅
- [x] **T8** · Interacciones friccionar (→brasa) y soplar (→fuego) + manejo de falla · _M_ ✅ `bece518`
- [x] ✅ **Checkpoint Slice jugable** — encender fuego end-to-end + camino de falla; **review ⇦ ACÁ**

## Phase 3 — Ciencia, misión y pulido
- [ ] **T9** · Panel científico + zoom molecular · _M_
- [ ] **T10** · Misión de Senku + temperatura del fuego + persistencia visible · _S/M_
- [ ] ✅ **Checkpoint Contenido completo** — Success Criteria del SPEC §9; review

## Phase 4 — Verificación y deploy
- [ ] **T11** · Tests E2E Playwright (happy path + falla) · _S/M_
- [ ] **T12** · Deploy a Vercel (preview) · _S_
- [ ] ✅ **Checkpoint Complete** — todo cumplido; E2E verde; preview desplegado

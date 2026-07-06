# TODO: Kingdom of Science — Invento #1 (El Fuego)

Plan completo en `tasks/plan.md`. Implementar con `/g-build` (un task por vez, en orden).

## Phase 1 — Foundation (lógica testeable sin UI)
- [x] **T1** · Scaffold Next.js + TS + Tailwind + React Flow + Zustand + Vitest/Playwright · _M_ ✅ `bdbb954`
- [x] **T2** · Tipos del dominio (`src/game/types`) · _S_ ✅ `716d41b`
- [x] **T3** · Motor de procesos genérico (`src/game/engine`) + tests · _M_ ✅ `f982841`
- [x] **T4** · Contenido del Fuego (`src/content`) + test de integridad · _M_ ✅ `ef6690d`
- [x] **T5** · Store Zustand + persist a localStorage + tests · _M_ ✅ `98f73e3`
- [x] ✅ **Checkpoint Foundation** — tests/typecheck/build en verde; flujo lógico del Fuego OK; **review ⇦ ACÁ**

## Phase 2 — Slice jugable (canvas de nodos) — ⚠️ SUPERSEDIDO por el REPLANTEO
- [x] **T6** · Canvas base React Flow + paleta de elementos arrastrables · _M_ ✅ `d18b1c6`
- [x] **T7** · Nodo custom + acción que dispara un paso (torcer → cuerda, tallar → taladro) · _M_ ✅
- [x] **T8** · Interacciones friccionar (→brasa) y soplar (→fuego) + manejo de falla · _M_ ✅ `bece518`
- [x] ✅ **Checkpoint Slice jugable** — encender fuego end-to-end (canvas de nodos)
- ⚠️ **Pivote (jul 2026):** el canvas de nodos se descarta. La mecánica pasa a ser la **Mesa de Trabajo** → ver Fase R.

---

## Phase R — La Mesa de Trabajo (mecánica central replanteada)
> Ver `tasks/plan.md` §REPLANTEO, `IDEA.md` §Pilar 1 y `PENDING.md` §DECISIÓN CLAVE.
- [x] **RT1** · Modelo de datos de la Mesa (`Piece`, `StepInteraction`, `ProcessStep`+, `AssemblyScene`) + tests · _S_ ✅
- [x] **RT2** · Reescribir contenido del Fuego (8 pasos + piezas + fix rigor piedra=cojinete) + tests · _M_ ✅
- [x] **RT3** · Extender el motor para pasos de ensamblaje (place correcto / gesto con umbral) + tests · _M_ ✅
- [x] **RT4** · Componente `<Mesa>` genérico (bandeja + slots + drag + panel de pasos) · _M/L_ ✅
- [x] **RT5** · Gestos IN-SITU en la escena (friccionar arrastrando, soplar, enrollar) + animación · _M_ ✅
- [x] **RT6** · Assets SVG de las piezas del Fuego (escena + thumbnails, del prototipo) · _M_ ✅
- [x] **RT7** · Integrar store + quitar React Flow · _S/M_ ✅
- [x] ✅ **Checkpoint Mesa jugable** — armar el taladro y encender el fuego en la Mesa, end-to-end ✅

## Phase 3 — Ciencia, misión y pulido
- [ ] **RT8** · Panel científico por paso + zoom molecular · _M_
- [ ] ✅ **Checkpoint Contenido completo** — Success Criteria del SPEC §9; review

## Phase 4 — Verificación y deploy
- [ ] **RT9** · Tests E2E Playwright (armado + happy path + falla) · _S/M_
- [ ] **RT10** · Deploy a Vercel (preview) · _S_
- [ ] ✅ **Checkpoint Complete** — todo cumplido; E2E verde; preview desplegado

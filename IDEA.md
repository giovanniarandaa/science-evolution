# Kingdom of Science

> Un juego web donde **reconstruís la civilización desde cero** al estilo *Dr. Stone*: redescubrís la ciencia combinando elementos y procesos en un grafo que crece frente a vos, **y reclutás, equipás y asignás a la gente de tu reino** para recolectar materiales y hacer posible cada invento. Cada nodo enseña ciencia **real** (qué es, de qué se compone). De frotar dos ramas para hacer fuego... hasta el teléfono.

---

## Problem Statement (How Might We)

**¿Cómo podríamos hacer que alguien de cualquier edad *sienta que redescubre la ciencia y reconstruye una civilización* —construyendo un grafo de tecnología y gestionando a su gente— de forma tan satisfactoria que aprenda de verdad cómo se compone el mundo, sin sentir que estudia?**

El hueco de mercado: existe lo *educativo-aburrido*, lo *adictivo-vacío* (Little Alchemy, Infinite Craft) y lo *riguroso-caótico* (Powder Toy). **Nadie hizo un grafo de la ciencia riguroso, guiado como Dr. Stone, satisfactorio de armar, Y con un reino que gestionás.** Ese es nuestro espacio.

---

## Principio central: el proceso ES el juego *(no botones)*

Esto es lo que nos separa de un tech tree tipo *Civilization* (donde "componentes + electricidad = tecnología", abstracto) y de *Little Alchemy* (combinás y sale un trofeo). **Acá cada invento es un procedimiento real, paso a paso, con condiciones físicas que hay que respetar.** Necesitás saber *cómo se construyen las cosas desde cero*.

No es *"¡felicidades, descubriste el fuego!"* — es aprender **cómo** hacer fuego, alimentarlo y calentarlo más. Nivel de detalle:

- **Cerámica:** conseguir arcilla → amasar con la proporción justa de agua → moldear → **secar al sol** (si te lo saltás, *se agrieta*) → cocer a la temperatura correcta.
- **Cal:** juntar conchas → **triturarlas/demolerlas** → calcinarlas a fuego fuerte hasta que se descomponen. No aparece cal mágicamente.
- **Refugio:** ramas + hojas ensambladas con técnica, no "casa desbloqueada".

**El fuego es una herramienta, no un trofeo.** Tiene temperatura, combustible y aire. Un fuego normal cuece barro; para **fundir arena → vidrio** necesitás uno mucho más caliente → eso te empuja a inventar el **fuelle / horno**. La temperatura es un recurso que gestionás. *(El principio "la escasez motiva el descubrimiento", aplicado a las condiciones del proceso.)*

**Consecuencia de diseño (disciplina de scope):** la profundidad vale más que la cantidad. **Mejor 3-4 inventos autorados como procedimientos completos que 20 combinaciones de un click.**

*Estrella polar (lejana):* construir un CPU o un monitor será su propia mini-simulación de proceso — "simular ser una máquina", cada capa fabricada paso a paso. Es el norte, no el MVP.

---

## Los dos pilares

### Pilar 1 — El Grafo del Conocimiento *(mecánica core)*

Un **"n8n de la ciencia"**: un canvas de nodos donde construís cadenas de dependencia tecnológica.

1. **El Grafo Vivo.** Nodos = materiales/elementos; aristas = acciones/procesos. Ej: `madera → [frotar] → fuego`, y ese `fuego` alimenta `arcilla → [calentar] → cerámica`. **El grafo que construís ES tu árbol de conocimiento, y crece visualmente.** Ves *toda la cadena*, no solo el resultado.
2. **Zoom Molecular *(el rigor)*.** Cada nodo tiene dos niveles: **macro** (agua) y **micro** (zoom → H₂O: dos hidrógenos + un oxígeno; fuego → oxidación exotérmica). Cumple el objetivo central: enseñar *qué ES* y *cómo se compone* cada cosa.
3. **Misiones de Senku *(dirección)*.** Un mentor da objetivos con historia ("la aldea está enferma → fabricá la sulfa") que guían por el árbol sin quitar la libertad de explorar.

**Elementos llave (gating):** ciertos nodos son cuellos de botella que **desbloquean ramas enteras**. Ej. real de Dr. Stone: quemar **conchas → cal**, y la cal abre vidrio + jabón + procesado. El momento *"¡ahora se abrió todo!"* es la adicción sana del juego.

### Pilar 2 — El Reino y su Gente *(gestión de población)*

Los humanos son la **fuerza de trabajo** que ejecuta el grafo de producción. Sin gente asignada, no hay materiales.

- **Población que crece:** ganás ~**1 humano por día**. Cada persona es un recurso valioso.
- **Zonas / biomas:** los materiales dependen del lugar. Conchas en la **playa**, madera en el **bosque**, minerales en **minas/montaña** o en el **río/agua**. Mandás humanos a recolectar donde corresponde — no podés sacar conchas del bosque.
- **Equipo tosco → refinado:** equipás a tu gente con herramientas que mejoran conforme inventás. `hacha fea de piedra → hacha de bronce → hacha de hierro → sierra`. Mejor equipo = más rendimiento.
- **Gating por equipo:** cierto equipo **desbloquea recursos peligrosos**. Ej: una **máscara anti-oxígeno tosca** (no la del siglo XXI — versión primitiva) habilita ir por **ácido sulfúrico**. La escasez motiva el siguiente invento.
- **Rasgos / habilidades:** los humanos nacen con talentos que definen su mejor rol:
  - 💪 **Resistencia / Fuerza** → recolección.
  - 🧠 **Inteligencia** → investigación (desbloquea recetas más rápido).
  - ✋ **Destreza / Artesanía** → mejor calidad de herramientas y objetos.
  - 🏗️ **Construcción** → edificios (hornos, talleres, recolectores).
  - ✨ **Inspiración** *(raro)* → posibilidad de descubrir recetas nuevas.

**Insight de diseño — dos grafos entrelazados:** el *Grafo del Conocimiento* (qué es posible) y el *Grafo de Producción* (quién lo hace, dónde, con qué). Los humanos son los "workers" que ejecutan los nodos → hace la metáfora n8n literal.

**Principio rector — "la escasez motiva el descubrimiento":** no poder acceder a un material crea *demanda de inventar*. Necesitar la máscara para el azufre te empuja a investigarla, y ahí aprendés la química. La gestión no distrae del aprendizaje: **lo motiva.**

---

## Recommended Direction

Empezar por el **Pilar 1** (el grafo + zoom molecular + misiones) con una **semilla mínima del Pilar 2** (unos pocos humanos que asignás a 2 zonas), para que desde el MVP se sienta un *reino* y funcione el loop económico:

> población → asignás a recolectar → materiales → crafteás en el grafo → mejor equipo/ciencia → desbloqueás más zonas y recetas → sostenés más población.

El sistema profundo de colonia (rasgos completos, cadenas de equipo, muchos biomas) es **Fase 2** — hermoso pero es donde el scope explota.

---

## Key Assumptions to Validate

- [ ] **Armar el grafo se siente satisfactorio, no tedioso.** → Prototipar el slice de la Edad de Piedra; probar con 3-5 personas: ¿siguen combinando sin que se lo pidan?
- [ ] **La gente lee el contenido científico** (no solo clickea para avanzar). → Observar si abren el panel "qué es esto" y el zoom molecular.
- [ ] **La capa de gestión NO diluye el aprendizaje.** → Confirmar que esperar/asignar humanos *motiva* inventar y no se vuelve un idle-clicker vacío.
- [ ] **El rigor y la diversión conviven.** → ¿Las reacciones reales se sienten "mágicas" o se sienten tarea?
- [ ] **React Flow (o similar) aguanta la mecánica** sin volverse un editor de diagramas frío. → Spike técnico: nodos custom + animación de desbloqueo.

---

## MVP Scope — Vertical Slice: "La Edad de Piedra"

Un slice temático completo y jugable de principio a fin, con foco en **profundidad de proceso, no cantidad de nodos**.

**Pilar 1 (core del MVP) — 3-4 "inventos-proceso" completos:**
- Canvas de nodos interactivo (drag & drop, conectar con acciones).
- **~15-20 elementos/materiales base** y **~5-8 acciones** (frotar, calentar, amasar, moler, secar, cocer) — al servicio de los procesos.
- **3-4 inventos autorados como procedimiento paso a paso**, cada uno con condiciones reales que se pueden *fallar*:
  1. **Hacer y controlar el fuego** (no un trofeo: alimentarlo, subir la temperatura).
  2. **Cerámica** (amasar → moldear → secar → cocer a temperatura).
  3. **Cal** (juntar conchas → triturar → calcinar) — el **elemento llave** que abre una rama.
  4. *(opcional)* **Refugio** (ramas + hojas ensambladas).
- **Panel científico por nodo** + **zoom molecular** en nodos clave (agua, fuego, cal).
- **1-2 misiones** estilo Senku que encadenan estos procesos.

**Pilar 2 (semilla mínima — ✅ confirmado):**
- **2-3 humanos** que asignás a **2 zonas** (bosque, playa) para recolectar.
- **1 nivel de herramienta** (hacha de piedra) — la mejora de equipo llega en Fase 2.
- Sin rasgos complejos todavía (o solo 1 distinción: recolector vs. no).

**Hipótesis que prueba:** *¿El grafo + composición molecular + un reino mínimo se siente como "redescubrir la ciencia" y enseña de verdad?* Si el slice logra eso, el resto es escalar contenido.

---

## Roadmap / Banco de ideas futuras

*(Guardadas para no perderlas — NO son del MVP.)*

**Eras siguientes:** Bronce → Hierro → Pólvora → Vidrio → Electricidad → Medicina (sulfa/penicilina) → Teléfono. (Tech tree canónico de Dr. Stone.)

**Ramas nuevas de ciencia:**
- 🔭 **Óptica:** lentes → telescopio → microscopio (desbloquea ver células y estrellas).
- 🧬 **Biología / anatomía:** el cuerpo humano por sistemas; el microscopio desbloquea células, bacterias, penicilina.
- 🐾 **Reino animal:** domesticación, ganadería, seda, tracción animal.
- 🌱 **Química avanzada:** ácidos/bases, tabla periódica interactiva, ácido sulfúrico + máscara.
- ⚙️ **Física / mecánica:** fuerzas, palancas, **poleas y engranajes** — energía y movimiento. Base de la automatización.
- 💧 **Rueda hidráulica + engranajes — HITO ÉPICO:** una rueda movida por la corriente de agua transmite fuerza mecánica que **automatiza el trabajo pesado** (moler, martillar, mover fuelles) sin esfuerzo humano; y más adelante, acoplada a imanes/bobina, **genera electricidad**. El salto de "todo a mano" a la energía mecánica → eléctrica. Puro Dr. Stone. 🔥
- ➗ **Matemáticas:** herramienta transversal (medir, proporciones, geometría) que habilita ingeniería y ciencia precisa.

**Sistema de reino (Pilar 2 completo):**
- Cadenas de equipo mejorable (hacha piedra → bronce → hierro → sierra; máscara tosca → respirador).
- Rasgos completos (fuerza, inteligencia, destreza, construcción, inspiración) y roles especializados.
- Más biomas (montaña, mina, río, cueva) con recursos peligrosos que requieren equipo.
- Edificios: hornos, talleres, recolectores automáticos, viviendas para sostener población.
- Eventos: nace un humano con inspiración → descubre una receta nueva.
- **Automatización (hito clave, inspirado en Dr. Stone):** máquinas —**engranajes, poleas**, molinos, norias— que **reemplazan el trabajo humano** y reducen el esfuerzo físico, liberando gente para tareas de mayor nivel. La progresión va de "todo a mano con humanos" → "mecanizado".

**Modos futuros:**
- **Niebla del Descubrimiento:** el árbol arranca oculto y se revela al combinar.
- **Línea de Tiempo Histórica:** grafo organizado por eras reales (inspiración "Connections").
- **Sandbox Simulado:** partículas reales tipo Powder Toy (muy ambicioso).
- **Simular ser una máquina:** construir CPU / monitor / electrónica como su propia simulación de proceso, capa por capa (la estrella polar del rigor).
- Logros y **wiki / enciclopedia de cada elemento** (qué es, cómo se compone, **con qué se fusiona/combina** — las recetas visibles), que se va completando a medida que descubrís. Compartir tu grafo/reino.
- **Animaciones de acciones (juice + humor):** cada acción se *ve* — soplás, torcés, friccionás o tallás sobre el material. Las que NO aplican son graciosas (torcer una piedra, soplarle a una roca 😄): el humor enseña qué no funciona. Refuerza "el proceso ES el juego". *(El motor ya distingue éxito / no-aplica / falla, así que es enganchar animación al resultado.)*

---

## Not Doing (and Why)

- **Cuentas / login / backend** — el MVP prueba mecánica + aprendizaje; se juega local. Persistencia = después.
- **Contenido más allá de la Edad de Piedra** — mejor un slice pulido que 5 eras a medias. Foco > amplitud.
- **Sistema de colonia profundo en el MVP** — rasgos completos, cadenas de equipo y muchos biomas son Fase 2. En el MVP solo la *semilla* del reino.
- **Simulación de física/partículas** — enorme costo técnico; el grafo ya enseña. Modo futuro.
- **IA generativa para combinaciones (tipo Infinite Craft)** — mata el rigor científico, que es nuestro diferenciador. Recetas curadas y correctas.
- **Abstraer inventos como un botón de "desbloqueado"** — rompería el principio central. Cada invento se *construye* como proceso, no se concede.

---

## Modo de trabajo (cómo construimos esto)

Proyecto de largo aliento, construido **invento por invento** a lo largo de muchas sesiones. Reglas del juego:

- **Incremental:** cada sesión agrega 1 invento (o un lote de 3-4), o mejora UX/UI. Puede haber un `SPEC` por invento.
- **Investigación primero (innegociable):** antes de construir un invento, investigar **(a)** cómo se hace *de verdad* (química/física/historia reales) y **(b)** si es el *siguiente* invento correcto en el árbol. El rigor manda.
- **Dispuestos a dar pasos atrás:** si descubrimos que "así no se hace tal invento", se corrige aunque implique rehacer. Correcto > rápido.
- **UX/UI evoluciona:** el diseño se refina con el tiempo; a veces se rediseña.

---

## Open Questions

- **✅ Decidido:** Pilar 2 en el MVP = *semilla mínima* (2-3 humanos, 2 zonas, 1 herramienta).
- **¿Cómo se representa un "proceso paso a paso" en la UI?** ¿Un sub-grafo dentro del nodo, una secuencia de pasos con condiciones (temperatura, secado, proporción), un mini-panel? ← clave para el spec.
- **Stack técnico:** ¿React + React Flow (@xyflow) + Next.js? → se define en `/g-spec`.
- **Formato del contenido:** elementos, recetas, zonas y humanos data-driven en JSON (recomendado, para escalar sin tocar código).
- **Loop de tiempo:** ¿el "1 humano por día" es tiempo real, por turnos, o por acciones completadas?
- **¿Cuál es el "invento hito" exacto** que cierra el MVP y da el primer gran "¡lo logré!"? (Candidato: la cerámica o la cal.)
- **Balance del panel educativo:** ¿cuánta info sin abrumar al de 10 años ni aburrir al de 30?

---

*Siguiente paso sugerido:* cuando quieras, corré **`/g-spec`** para convertir esto en una especificación técnica (modelo de datos de elementos/recetas/zonas/humanos, arquitectura del canvas, primeras pantallas).

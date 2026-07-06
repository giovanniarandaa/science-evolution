# PENDING — Notas para futuras sesiones

> Cosas que vamos notando y no queremos olvidar. Documento vivo. Las ideas de *gameplay/contenido* van en `IDEA.md` (banco de ideas); acá van **pendientes accionables, decisiones a revisitar y notas técnicas**.

## ✅ DECISIÓN CLAVE — la Mesa de Trabajo (jul 2026)

**Encontramos la mecánica central del juego.** Se **descarta el paradigma n8n / canvas de nodos-y-cables** como interacción central (se prototiparon 6 modelos y no era lo que el usuario buscaba). La mecánica es la **Mesa de Trabajo**: arrastrás las **piezas reales** (rama, cuerda, piedra, husillo…) y la herramienta **se ensambla paso a paso** (~5-10 instrucciones reales, dibujadas en SVG), con **gestos físicos** (frotás el arco ↔ para hacer fricción → brasa → soplás → fuego). Reacción del usuario: *"JAJAJA me encanta, esto es lo que busco"*.

- **NO se necesita motor de juego externo** (Phaser/Pixi/Godot). React + SVG + animación (CSS / Web Animations / Motion) alcanza y es lo ideal (data-driven, vectorial, mantiene el stack y Vercel). Pixi/Phaser recién se evaluaría para el **mundo del Pilar 2** (humanos caminando, físicas). El **motor de lógica** (`src/game/engine`) ya existe, es agnóstico de UI y **se conserva**.
- **Prototipos (Artifacts, privados del usuario):**
  - Comparador de 6 modelos de interacción → `claude.ai/code/artifact/9ea5f11d-5afa-42e0-abd6-400e40fbe7dc`
  - **Mesa de Trabajo — taladro de arco paso a paso (el elegido)** → `claude.ai/code/artifact/b269f6c0-9608-48c0-9525-f8676d31e094`
- **Detalles a decidir antes de llevarlo al juego:**
  - ¿Ensamblaje **guiado** (una pieza por vez, como el prototipo) o **libre** (cualquier orden, con validación)?
  - Nivel de realismo de la animación (aserrín cayendo, giro del husillo más marcado, humo).
  - Dirección de arte (¿más ilustrado / estilo *Dr. Stone*?). → va con la sesión de arte.
  - **Modelo de datos:** `Process`/`ProcessStep` debe soportar **sub-pasos de ensamblaje** (colocar pieza, gesto, condición). Replantear SPEC.md y `tasks/`.
- **Rigor a corregir en el contenido del Fuego** (surgió al investigar el *bow drill*): la **piedra es el cojinete** que sostenés arriba (NO se consume al "tallar"); el arco necesita **husillo + tabla de fuego + muesca en V**; la brasa nace del polvo a **~430 °C** (hoy brasa=300 / fuego=600 → revisar). Fuentes citadas en el prototipo.

## 🎨 Sesiones futuras planeadas

- **Arte / dirección visual** — el MVP arranca con estilo funcional limpio. El diseño distintivo (paleta, tipografía, ilustración de nodos, "sabor" Dr. Stone) merece su propia sesión con `frontend-design`. **Agendar después del slice jugable (post-T8).**
  - **Íconos → SVG:** reemplazar los emojis (placeholder) por **SVG**. Fuente recomendada: [game-icons.net](https://game-icons.net) (+4000 íconos estilo juego, CC-BY 3.0, monocromáticos → coloreables para dar identidad). Agregar campo `icon?` al `Element` con fallback a emoji. *Motivo:* los emojis son inconsistentes entre sistemas, genéricos y limitados (no hay para taladro de arco, cal, salitre…).
  - **Light mode → toggle:** hoy forzamos light (variante `dark:` neutralizada pero las clases siguen en el código). Cuando se quiera, reactivar un toggle claro/oscuro es trivial.
  - **Animaciones de acciones (juice + humor):** al ejecutar una acción, animarla visualmente (soplar, torcer, friccionar, tallar *sobre* el material). Las que no aplican, con humor (torcer una piedra 😄). El motor ya distingue éxito / no-aplica / falla → es enganchar la animación al resultado. Va junto con los assets visuales.

## 📦 Scope diferido (confirmado fuera del MVP actual)

- **Capa de humanos / reino (Pilar 2)** → entra en el **2º invento** (cerámica/cal) con recolección por zonas. NO en el Fuego.
- **Backend + base de datos** → solo cuando lleguen **cuentas / sync entre dispositivos / leaderboards**.
- **Eras posteriores** (bronce, hierro, pólvora, vidrio, electricidad, medicina, teléfono) → ver banco de ideas en `IDEA.md`.
- **Ramas nuevas** (óptica → telescopio/microscopio, biología/anatomía, reino animal, química avanzada) → `IDEA.md`.

## 🔧 Decisiones a revisitar

- **✅ RESUELTO — UX de acciones:** ver *"DECISIÓN CLAVE — la Mesa de Trabajo"* arriba. La interacción de seleccionar-nodos + barra de botones **queda descartada**; la reemplaza el ensamblaje en la mesa de trabajo.
- **✅ RESUELTO — UX de friccionar:** el "mantener presionado" se reemplaza por el **gesto de frotar el arco de lado a lado** (la fricción sube con la velocidad real del gesto). Validado en el prototipo.
- **A decidir — guiado vs libre:** el prototipo es **guiado** (una pieza por vez). Falta decidir si en el juego se permite orden libre. (Ya no aplica "canvas libre estilo n8n": no hay canvas de nodos.)
- **Gestor de paquetes:** pnpm elegido. (bun quedó descartado por edge cases con el dev server de Next.)

## 📝 Notas sueltas

- *(se irán agregando a medida que surjan durante el build)*

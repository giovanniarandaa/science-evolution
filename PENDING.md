# PENDING — Notas para futuras sesiones

> Cosas que vamos notando y no queremos olvidar. Documento vivo. Las ideas de *gameplay/contenido* van en `IDEA.md` (banco de ideas); acá van **pendientes accionables, decisiones a revisitar y notas técnicas**.

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

- **⭐ Rediseñar la UX de acciones (feedback del usuario, IMPORTANTE):** la interacción actual —seleccionar nodos + barra de botones (Torcer/Tallar/Friccionar/Soplar)— **NO convence**: *"me lo imaginaba diferente"*. Explorar alternativas antes de escalar contenido: arrastrar un nodo sobre otro (estilo Little Alchemy), conectar nodos con aristas hacia un nodo-acción (n8n puro), menú contextual al soltar, o que las acciones emerjan del propio material. Es la **interacción central del juego** → merece su propia exploración de diseño.
- **UX de friccionar:** MVP usa "mantener presionado con barra de progreso". Revisar si hay una interacción más satisfactoria (ritmo, arrastre) cuando lo probemos.
- **Canvas libre vs guiado:** arrancamos libre estilo n8n con snapping. Revisar si abruma.
- **Gestor de paquetes:** pnpm elegido. (bun quedó descartado por edge cases con el dev server de Next.)

## 📝 Notas sueltas

- *(se irán agregando a medida que surjan durante el build)*

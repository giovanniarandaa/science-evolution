import { WOOD1, WOOD2, WOOD3, ROCK2, ROPE1, ROPE2, FIRE } from "../art";

/**
 * Escena del invento del Fuego: dibuja el taladro de arco ARMÁNDOSE pieza por
 * pieza y la fricción → brasa → fuego. Portada del prototipo validado.
 *
 * Es una escena POR-INVENTO (el arte es específico); la Mesa genérica la elige
 * por `process.id`. Se controla por el estado del ensamblaje (qué slots están
 * llenos, qué se produjo, el paso activo).
 */
export interface SceneProps {
  filledSlots: string[];
  produced: string[];
  completedStepIds: string[];
  activeStepId?: string;
  /** Esfuerzo del gesto en curso (0..1): el humo/giro crecen con él. */
  intensity?: number;
}

const CSS = `
@keyframes kos-spin { from { transform: translateX(0) } to { transform: translateX(16px) } }
@keyframes kos-flick { from { transform: scaleY(.92) scaleX(1.02) } to { transform: scaleY(1.06) scaleX(.96) } }
@keyframes kos-ember { from { opacity: .65 } to { opacity: 1 } }
@keyframes kos-smoke { 0% { opacity: 0; transform: translateY(6px) } 55% { opacity: .8 } 100% { opacity: 0; transform: translateY(-16px) } }
.kos-grain { animation: kos-spin .18s linear infinite; }
.kos-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: kos-flick .5s ease-in-out infinite alternate; }
.kos-flame.f2 { animation-duration: .38s; }
.kos-flame.f3 { animation-duration: .62s; }
.kos-ember { animation: kos-ember 1.1s ease-in-out infinite alternate; }
.kos-smoke { animation: kos-smoke 1.4s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .kos-grain, .kos-flame, .kos-ember, .kos-smoke { animation: none; }
}
`;

export function TaladroArcoScene({
  filledSlots,
  produced,
  completedStepIds,
  activeStepId,
  intensity = 0,
}: SceneProps) {
  const has = (slot: string) => filledSlots.includes(slot);
  const done = (id: string) => completedStepIds.includes(id);
  const hasBrasa = produced.includes("brasa");
  const hasFuego = produced.includes("fuego");
  const friccionando = activeStepId === "friccionar";
  const spinning = friccionando && intensity > 0.03;
  const humoOpacity = friccionando
    ? Math.min(1, intensity * 1.5)
    : hasBrasa && !hasFuego
      ? 0.9
      : 0;
  const vis = (on: boolean) => ({ opacity: on ? 1 : 0, transition: "opacity .45s ease" });

  return (
    <svg
      viewBox="0 0 520 400"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kosWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={WOOD1} />
          <stop offset="1" stopColor={WOOD3} />
        </linearGradient>
        <linearGradient id="kosSpindle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={WOOD3} />
          <stop offset=".45" stopColor={WOOD1} />
          <stop offset=".55" stopColor={WOOD1} />
          <stop offset="1" stopColor={WOOD3} />
        </linearGradient>
        <linearGradient id="kosRock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ROCK2} stopOpacity="0.75" />
          <stop offset="1" stopColor={ROCK2} />
        </linearGradient>
        <radialGradient id="kosEmber" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset=".4" stopColor="#ff8a1e" />
          <stop offset="1" stopColor="#b81b0d" />
        </radialGradient>
        <linearGradient id="kosFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset=".5" stopColor="#f97316" />
          <stop offset="1" stopColor="#fde047" />
        </linearGradient>
        <filter id="kosSoft">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* yesca / nido (pre-puesto en la mesa) */}
      <g style={{ opacity: hasBrasa || hasFuego ? 1 : 0.5, transition: "opacity .45s ease" }}>
        <ellipse cx="150" cy="312" rx="42" ry="13" fill={WOOD3} opacity="0.5" />
        <ellipse cx="150" cy="308" rx="40" ry="12" fill="none" stroke={ROPE2} strokeWidth="2" />
        <path
          d="M116 308 q34 -16 68 0 M122 305 q28 -12 56 0 M128 311 q22 -8 44 0"
          stroke={ROPE1}
          strokeWidth="1.6"
          fill="none"
          opacity="0.9"
        />
      </g>

      {/* tabla de fuego */}
      <g style={vis(has("base"))}>
        <rect x="92" y="300" width="336" height="26" rx="6" fill="url(#kosWood)" stroke={WOOD3} strokeWidth="1.5" />
        <path d="M104 306 h312 M104 313 h300 M104 320 h280" stroke={WOOD3} strokeWidth="1" opacity="0.45" />
        <ellipse cx="150" cy="300" rx="14" ry="4" fill={WOOD3} opacity="0.55" />
      </g>

      {/* muesca en V (al friccionar) */}
      <g style={vis(friccionando || hasBrasa)}>
        <path d="M240 300 L262 300 L251 292 Z" fill="#2a1a0e" />
        <path d="M244 300 L262 300 L253 300 L251 314 Z" fill="#2a1a0e" opacity="0.8" />
      </g>

      {/* husillo */}
      <g style={vis(has("husillo"))}>
        <polygon points="255,300 271,300 263,312" fill={WOOD3} />
        <rect x="255" y="140" width="16" height="162" rx="7" fill="url(#kosSpindle)" stroke={WOOD3} strokeWidth="1.2" />
        <g className={spinning ? "kos-grain" : undefined} style={{ opacity: friccionando ? 0.5 : 0 }}>
          <path
            d="M257 150 l12 8 M257 168 l12 8 M257 186 l12 8 M257 204 l12 8 M257 222 l12 8 M257 240 l12 8 M257 258 l12 8 M257 276 l12 8"
            stroke={WOOD3}
            strokeWidth="1.4"
            fill="none"
          />
        </g>
        <ellipse cx="263" cy="142" rx="8" ry="4" fill={WOOD1} />
      </g>

      {/* arco */}
      <g style={vis(has("arco"))}>
        <path d="M120 206 C 180 176, 340 176, 404 224" stroke={WOOD2} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M120 206 C 180 176, 340 176, 404 224" stroke={WOOD1} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <circle cx="120" cy="206" r="6" fill={WOOD3} />
        <circle cx="404" cy="224" r="6" fill={WOOD3} />
      </g>

      {/* cuerda tensada */}
      <g style={vis(has("cuerda"))}>
        <path d="M120 206 L404 224" stroke={ROPE2} strokeWidth="2.4" fill="none" />
        <path d="M120 206 L404 224" stroke={ROPE1} strokeWidth="1" fill="none" strokeDasharray="3 3" />
      </g>

      {/* vuelta de cuerda alrededor del husillo */}
      <g style={vis(done("enrollar"))}>
        <ellipse cx="263" cy="212" rx="13" ry="7" fill="none" stroke={ROPE2} strokeWidth="2.6" />
        <ellipse cx="263" cy="212" rx="13" ry="7" fill="none" stroke={ROPE1} strokeWidth="1" strokeDasharray="2 3" />
      </g>

      {/* piedra cojinete */}
      <g style={vis(has("cojinete"))}>
        <path
          d="M236 132 q-6 -20 18 -24 q16 -6 30 4 q18 8 12 22 q-4 12 -30 12 q-24 0 -30 -14 Z"
          fill="url(#kosRock)"
          stroke={ROCK2}
          strokeWidth="1.5"
        />
        <ellipse cx="263" cy="138" rx="7" ry="3.4" fill={ROCK2} />
        <path d="M244 120 q8 -6 20 -4" stroke="#fff" strokeWidth="1.4" fill="none" opacity="0.25" />
      </g>

      {/* humo (crece con el esfuerzo del gesto) */}
      <g style={{ opacity: humoOpacity, transition: "opacity .2s ease" }}>
        <circle className="kos-smoke" style={{ animationDelay: "0s" }} cx="248" cy="290" r="9" fill="#bdbdbd" filter="url(#kosSoft)" />
        <circle className="kos-smoke" style={{ animationDelay: ".45s" }} cx="256" cy="278" r="7" fill="#cfcfcf" filter="url(#kosSoft)" />
        <circle className="kos-smoke" style={{ animationDelay: ".9s" }} cx="244" cy="266" r="6" fill="#e0e0e0" filter="url(#kosSoft)" />
      </g>

      {/* brasa */}
      <g style={vis(hasBrasa && !hasFuego)}>
        <circle className="kos-ember" cx="250" cy="304" r="13" fill="url(#kosEmber)" filter="url(#kosSoft)" />
        <circle cx="250" cy="304" r="6" fill="#fff2b0" />
      </g>

      {/* fuego */}
      <g style={vis(hasFuego)}>
        <ellipse cx="150" cy="312" rx="30" ry="8" fill={FIRE} opacity="0.35" filter="url(#kosSoft)" />
        <path className="kos-flame f1" d="M150 316 C132 292 140 274 150 256 C160 274 168 292 150 316 Z" fill="url(#kosFlame)" />
        <path className="kos-flame f2" d="M134 316 C124 300 128 288 136 276 C144 290 146 302 134 316 Z" fill="url(#kosFlame)" opacity="0.9" />
        <path className="kos-flame f3" d="M166 316 C158 302 160 290 168 280 C176 292 176 304 166 316 Z" fill="url(#kosFlame)" opacity="0.9" />
        <path className="kos-flame f2" d="M150 314 C142 300 146 292 150 282 C155 292 158 300 150 314 Z" fill="#fde047" />
      </g>
    </svg>
  );
}

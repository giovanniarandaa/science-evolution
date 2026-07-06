import { WOOD1, WOOD2, WOOD3, ROCK1, ROCK2, ROPE1, ROPE2 } from "./art";

/**
 * Miniatura SVG de una pieza, para la bandeja. Portada de los thumbnails del
 * prototipo. Si la pieza no tiene dibujo aún, cae al `fallback` (emoji).
 */
export function PieceThumb({
  pieceId,
  fallback,
  className = "h-9 w-9",
}: {
  pieceId: string;
  fallback?: string;
  className?: string;
}) {
  const common = { viewBox: "0 0 44 44", className } as const;

  switch (pieceId) {
    case "tabla_fuego":
      return (
        <svg {...common}>
          <rect x="4" y="18" width="36" height="12" rx="3" fill={WOOD1} stroke={WOOD3} />
          <path d="M8 22h28M8 26h24" stroke={WOOD3} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "husillo":
      return (
        <svg {...common}>
          <rect x="19" y="6" width="6" height="30" rx="3" fill={WOOD1} stroke={WOOD3} />
          <polygon points="19,36 25,36 22,42" fill={WOOD3} />
        </svg>
      );
    case "arco":
      return (
        <svg {...common}>
          <path d="M6 14 C16 6 30 6 38 16" stroke={WOOD2} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M6 14 L38 16" stroke={ROPE2} strokeWidth="1.5" />
        </svg>
      );
    case "cuerda_arco":
      return (
        <svg {...common}>
          <path d="M6 30 q6 -14 12 0 t12 0 t8 0" stroke={ROPE2} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M6 30 q6 -14 12 0 t12 0 t8 0" stroke={ROPE1} strokeWidth="1.2" fill="none" strokeDasharray="2 3" />
        </svg>
      );
    case "cojinete_piedra":
      return (
        <svg {...common}>
          <path
            d="M8 26 q-3 -12 10 -15 q10 -3 16 3 q9 6 4 13 q-4 6 -16 6 q-12 0 -14 -7 Z"
            fill={ROCK1}
            stroke={ROCK2}
          />
        </svg>
      );
    default:
      return <span className="text-2xl leading-none">{fallback ?? "🔩"}</span>;
  }
}

import type { Molecule, ScienceInfo } from "@/game/types";

/** Algo con ficha científica: un material (Element) o una pieza (compuesto). */
export interface SciSubject {
  name: string;
  emoji?: string;
  science?: ScienceInfo;
  molecule?: Molecule;
}

/** Colores CPK-ish por átomo, para el zoom molecular. */
const ATOM_COLOR: Record<string, string> = {
  C: "#3f3f46",
  H: "#60a5fa",
  O: "#dc2626",
  N: "#2563eb",
  S: "#ca8a04",
};
const atomColor = (symbol: string) => ATOM_COLOR[symbol] ?? "#78716c";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "fuente";
  }
}

function ZoomMolecular({ molecule }: { molecule: Molecule }) {
  return (
    <section className="rounded-xl border border-lime-200 bg-lime-50/60 p-3">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-lime-700">
        🔬 Zoom molecular
      </h3>
      <p className="mt-1 font-mono text-lg font-bold text-stone-800">{molecule.formula}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {molecule.atoms.map((a) => (
          <div key={a.symbol} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 shadow-sm">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: atomColor(a.symbol) }}
            >
              {a.symbol}
            </span>
            <span className="text-xs text-stone-600">
              ×{a.count} · {a.name}
            </span>
          </div>
        ))}
      </div>

      {molecule.reaction && (
        <p className="mt-3 rounded-lg bg-stone-900 px-3 py-2 text-center font-mono text-sm text-lime-200">
          {molecule.reaction}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-stone-600">{molecule.description}</p>
    </section>
  );
}

/**
 * Panel "¿Qué es esto?" — la ciencia real de un material o de una pieza (compuesto):
 * qué es, cómo se compone, dato curioso, fuentes, y zoom molecular si tiene molécula.
 * Si el sujeto es una pieza fabricada, `madeFrom` muestra **de qué material está hecha**
 * (con la molécula del material), para que las relaciones queden claras.
 *
 * Es una card flotante, NO un modal que tapa la mesa. Cumple el objetivo #1:
 * enseñar de qué se compone el mundo.
 */
export function SciencePanel({
  subject,
  madeFrom,
  onClose,
}: {
  subject: SciSubject;
  madeFrom?: SciSubject;
  onClose: () => void;
}) {
  const science = subject.science;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[82vh] max-w-md overflow-y-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl sm:inset-x-auto sm:right-4 sm:mx-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {subject.emoji && <span className="text-3xl leading-none">{subject.emoji}</span>}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">¿Qué es?</p>
            <h2 className="text-lg font-bold text-stone-800">{subject.name}</h2>
          </div>
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {science ? (
          <>
            <p className="text-sm leading-relaxed text-stone-700">{science.whatIsIt}</p>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                Composición
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{science.composition}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-stone-500">Todavía no hay ficha científica de esto.</p>
        )}

        {subject.molecule && <ZoomMolecular molecule={subject.molecule} />}

        {/* De qué material está hecha (para piezas/compuestos) */}
        {madeFrom && (
          <section className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
              Hecho de
            </h3>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-stone-800">
              {madeFrom.emoji && <span className="text-xl leading-none">{madeFrom.emoji}</span>}
              {madeFrom.name}
            </p>
            {madeFrom.science && (
              <p className="mt-1 text-xs leading-relaxed text-stone-600">
                {madeFrom.science.whatIsIt}
              </p>
            )}
            {madeFrom.molecule && (
              <div className="mt-2">
                <ZoomMolecular molecule={madeFrom.molecule} />
              </div>
            )}
          </section>
        )}

        {science?.funFact && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            💡 {science.funFact}
          </p>
        )}

        {science?.sources && science.sources.length > 0 && (
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
              Fuentes
            </h3>
            <ul className="mt-1 flex flex-wrap gap-2">
              {science.sources.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-lime-700 underline decoration-lime-300 hover:decoration-lime-600"
                  >
                    {hostOf(url)} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-6xl" role="img" aria-label="fuego">
        🔥
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">Kingdom of Science</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Reconstruí la civilización redescubriendo la ciencia, paso a paso.
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500">
        Scaffold listo · el canvas del primer invento (el Fuego) viene pronto.
      </p>
    </main>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center">
        <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full ring-2 ring-slate-200 overflow-hidden mb-6">
          <img src="/erumna-placeholder.svg" alt="Erumna avatar" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">Erumna · Latina Chat</h1>
        <p className="text-slate-600 mb-8">
          Philosophia Romana ✦ interpres antiquitatis ad usum hodiernum.
        </p>

        <div className="mx-auto max-w-2xl text-left space-y-6">
          <section>
            <h2 className="font-medium mb-2 text-center">Praesentatio (Latine)</h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
Salvē! Erumna sum, philosopha Romana...
            </pre>
          </section>

          <section>
            <h2 className="font-medium mb-2 text-center">Presentazione (Italiano)</h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
Salve! Sono Erumna, una filosofa romana...
            </pre>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/chat" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-6 py-3 font-medium shadow-sm hover:bg-sky-700 transition">
            Apri la chat
          </Link>
        </div>
      </div>
    </main>
  );
}

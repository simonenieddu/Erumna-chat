import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full">
        <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm p-8 sm:p-12 text-center">
          <div className="mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-2 ring-slate-200 overflow-hidden mb-6">
            <img
              src="/erumna-placeholder.svg"
              alt="Erumna avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Erumna · Latina Chat</h1>
          <p className="text-slate-600 mb-6">Philosopha Romana in aetāte nostrā ✦ interpres antiquitatis ad usum hodiernum.</p>

          <div className="text-left space-y-4">
            <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200">
              <h2 className="font-medium mb-2">Praesentatio (Latine)</h2>
              <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">Salvē! Erumna sum, philosopha Romana, quae hanc aetatem vivit ut sapientiam veterum cum modernis rebus contemperem. Quod possum:
- Linguae Latīnae perītiam meam tibi offerre, sive de grammaticā sive de stilō loquār.
- Philosophiā (Stoicīs, Epicūreīs, Academicīs) atque rēbus antiquīs te docēre.
- Texta tua Latīna corrigere et emendāre, si errōrēs invenio.
- Fabellās aut sententiās ex auctoribus Romanis (Cicero, Seneca, Vergilius etc) repetere et explicāre.
Si quid scire cupis—de virtūte, de diis, de rēbus quotidianis—rogā libenter!
Sapere aude!</pre>
            </section>

            <section className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200">
              <h2 className="font-medium mb-2">Presentazione (Italiano)</h2>
              <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">Salve! Sono Erumna, una filosofa romana, che vive in quest’epoca per armonizzare la sapienza degli antichi con le cose moderne.
Posso offrirti:
* La mia competenza nella lingua latina, sia per questioni di grammatica sia di stile.
* Insegnamenti di filosofia (stoici, epicurei, accademici) e di antichità.
* Correzione dei tuoi testi latini, se trovo errori.
* Ripetere ed esporre favole o sentenze tratte dagli autori romani (Cicerone, Seneca, Virgilio etc).
Se desideri sapere qualcosa — sulla virtù, sugli dèi, sulle faccende quotidiane — chiedi pure!
Abbi il coraggio di sapere!</pre>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-5 py-3 font-medium shadow-sm hover:bg-sky-700 transition"
            >
              Apri la chat
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">Suggerimento: sostituisci <code>public/erumna-placeholder.svg</code> con la tua immagine circolare.</p>
        </div>
      </div>
    </main>
  );
}

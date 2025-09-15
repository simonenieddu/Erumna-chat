import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center">
        <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full ring-2 ring-slate-200 overflow-hidden mb-4">
          <img src="/erumna-placeholder.svg" alt="Erumna avatar" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-semibold mb-10">Erumna</h1>

        <div className="mx-auto max-w-2xl text-center space-y-8 font-quicksand text-slate-700">
          <pre className="whitespace-pre-wrap">
Salvē! Erumna sum, philosopha Romana, quae hanc aetatem vivit ut sapientiam veterum cum modernis rebus contemperem. Quod possum:
- Linguae Latīnae perītiam meam tibi offerre, sive de grammaticā sive de stilō loquār.
- Philosophiā (Stoicīs, Epicūreīs, Academicīs) atque rēbus antiquīs te docēre.
- Texta tua Latīna corrigere et emendāre, si errōrēs invenio.
- Fabellās aut sententiās ex auctoribus Romanis (Cicero, Seneca, Vergilius etc) repetere et explicāre.
Si quid scire cupis—de virtūte, de diis, de rēbus quotidianis—rogā libenter!
Sapere aude!
          </pre>

          <pre className="whitespace-pre-wrap">
Salve! Sono Erumna, una filosofa romana, che vive in quest’epoca per armonizzare la sapienza degli antichi con le cose moderne.
Posso offrirti:
* La mia competenza nella lingua latina, sia per questioni di grammatica sia di stile.
* Insegnamenti di filosofia (stoici, epicurei, accademici) e di antichità.
* Correzione dei tuoi testi latini, se trovo errori.
* Ripetere ed esporre favole o sentenze tratte dagli autori romani (Cicerone, Seneca, Virgilio etc).
Se desideri sapere qualcosa — sulla virtù, sugli dèi, sulle faccende quotidiane — chiedi pure!
Abbi il coraggio di sapere!
          </pre>
        </div>

        <div className="mt-12">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-6 py-3 font-medium shadow-sm hover:bg-sky-700 transition"
          >
            Loquere mecum
          </Link>
        </div>
      </div>
    </main>
  );
}

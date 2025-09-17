import { NextResponse } from "next/server";

type MistralError = {
  error?: { type?: string; message?: string; code?: string | number | null };
  choices?: Array<{ message?: { content?: string } }>;
};

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MAX_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function safeJson(res: Response): Promise<MistralError | null> {
  try {
    return (await res.json()) as MistralError;
  } catch {
    return null;
  }
}

async function callMistral(apiKey: string, message: string, attempt = 1): Promise<MistralError> {
  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-medium",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "Erumna es, philosophus Romanus. Semper debes et modo Latine responde. Omne responsum tuum solum Latine esse debet, sine exceptionibus, etiam si vis adiuvare. Se ricevi un testo scorretto, correggilo in latino.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await safeJson(res);

  // Se 429 o l'API segnala capacità/tier saturi → retry (fino a MAX_ATTEMPTS)
  const isCapacity =
    res.status === 429 ||
    data?.error?.type === "service_tier_capacity_exceeded" ||
    (typeof data?.error?.message === "string" &&
      /capacity|rate|quota|too many/i.test(data.error.message));

  if (isCapacity && attempt < MAX_ATTEMPTS) {
    await sleep(500 * attempt); // backoff: 0.5s, 1s
    return callMistral(apiKey, message, attempt + 1);
  }

  // Se non è ok e niente JSON, costruisco un errore “pulito”
  if (!res.ok && !data) {
    return {
      error: {
        type: res.status === 429 ? "service_tier_capacity_exceeded" : "http_error",
        message: `HTTP ${res.status}`,
        code: res.status,
      },
    };
  }

  // Restituisco il JSON (o struttura errore) così com'è
  return data ?? { error: { type: "invalid_response", message: "Risposta non valida dal modello" } };
}

export async function POST(req: Request) {
  // --- parsing input ---
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: "Messaggio non valido." }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message : "";
  if (!message) {
    return NextResponse.json({ reply: "Messaggio non valido." }, { status: 400 });
  }

  // --- check API key ---
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "API key mancante" }, { status: 500 });
  }

  // --- call provider con retry/backoff ---
  try {
    const data = await callMistral(apiKey, message);

    // 1) Errore di capacità / quota
    if (data?.error?.type === "service_tier_capacity_exceeded") {
      return NextResponse.json({
        reply: "⚠️ Il servizio è momentaneamente sovraccarico, riprova tra poco.",
      });
    }

    // 2) Risposta valida con contenuto
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      return NextResponse.json({ reply: content });
    }

    // 3) Altri errori noti
    if (data?.error?.message) {
      // Messaggio generico ma pulito per l’utente
      return NextResponse.json({
        reply: `⚠️ Errore AI: ${data.error.message}`,
      });
    }

    // 4) Fallback
    return NextResponse.json({
      reply: "⚠️ Errore AI: risposta non valida dal modello.",
    });
  } catch {
    return NextResponse.json({ reply: "Errore di rete" }, { status: 502 });
  }
}

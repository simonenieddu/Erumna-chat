import { NextResponse } from "next/server";

// funzione helper per chiamare Mistral con retry
async function callMistral(apiKey: string, message: string, attempt = 1): Promise<any> {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
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

  const data = await res.json();

  // retry automatico se il modello è saturo
  if (data?.error?.type === "service_tier_capacity_exceeded" && attempt < 3) {
    console.warn(`Tentativo ${attempt} fallito: modello saturo. Ritento...`);
    await new Promise((r) => setTimeout(r, 500 * attempt)); // backoff progressivo
    return callMistral(apiKey, message, attempt + 1);
  }

  return data;
}

export async function POST(req: Request) {
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

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "API key mancante" }, { status: 500 });
  }

  try {
    const data = await callMistral(apiKey, message);

    if (data?.error?.type === "service_tier_capacity_exceeded") {
      return NextResponse.json({
        reply: "⚠️ Il servizio è momentaneamente sovraccarico, riprova tra poco.",
      });
    }

    if (data?.choices?.[0]?.message?.content) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    } else {
      return NextResponse.json({
        reply: "⚠️ Errore AI: " + (data?.error?.message || "risposta non valida"),
      });
    }
  } catch (e) {
    return NextResponse.json({ reply: "Errore di rete" }, { status: 502 });
  }
}

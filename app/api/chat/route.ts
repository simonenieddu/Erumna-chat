import { NextResponse } from "next/server";

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

    if (data?.choices?.[0]?.message?.content) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    } else {
      return NextResponse.json({ reply: "Errore AI: " + JSON.stringify(data) });
    }
  } catch (e) {
    return NextResponse.json({ reply: "Errore di rete" }, { status: 502 });
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ reply: "Messaggio non valido." }, { status: 400 });
  }
  const message = typeof body?.message === "string" ? body.message : "";
  if (!message) {
    return NextResponse.json({ reply: "Messaggio non valido." }, { status: 400 });
  }

  const url = process.env.BACKEND_URL; // es: https://tuo-sito.altervista.org/chatbot.php

  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof (data as any)?.reply === "string") {
          return NextResponse.json({ reply: (data as any).reply });
        }
      }
    } catch (e) {
      // fallback sotto
    }
  }

  const reply = `**Seneca:** Salve, amice! Dum loquimur, fugerit invida aetas. Quid vis discere hodie?
**Erumna:** Possum te iuvare de grammatica, moribus Stoicorum, atque de auctoribus classicis.
**Consilium:** Scribe quaestionem tuam simpliciter; respondebo Latine breviter et benevolenter.`;
  return NextResponse.json({ reply });
}

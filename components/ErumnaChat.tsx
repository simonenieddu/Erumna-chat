'use client';

import { useEffect, useRef, useState } from "react";

const demoReplies = [
  "Salve! Ego sum Erumna. Quid hodie discere vis?",
  "Latine respondeo celeriter et blande. ☺︎",
  "Possum explicare grammaticam, vocabula, vel historiam litterarum.",
  "Si vis, docebo te etiam iocose!",
];

type Msg = { id: number; role: "user" | "assistant"; text: string; ts: Date };

export default function ErumnaChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "assistant", text: "Salve! Ego sum Erumna, tua amica Latina.", ts: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState<"demo" | "live">("live");
  const [avatarUrl, setAvatarUrl] = useState("/erumna-placeholder.svg");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Msg = { id: Date.now(), role: "user", text, ts: new Date() };
    setMessages((m) => [...m, userMsg]);

    setIsSending(true);
    try {
      let reply = "";
      if (mode === "demo") {
        await new Promise((r) => setTimeout(r, 600));
        reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        reply = data?.reply ?? "(nessuna risposta dal server)";
      }
      const botMsg: Msg = { id: Date.now() + 1, role: "assistant", text: reply, ts: new Date() };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      const botMsg: Msg = {
        id: Date.now() + 2,
        role: "assistant",
        text: "(Errore di rete. Controlla BACKEND_URL su Vercel o riprova.)",
        ts: new Date(),
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img src={avatarUrl} alt="Erumna avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Erumna · Latina Chat</h1>
              <p className="text-xs text-slate-500">UI a fumetto · reattiva e moderna</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">Avatar URL</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Incolla qui l'immagine di Erumna"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Modo</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {(["demo", "live"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={
                      "px-3 py-1 text-sm rounded-lg transition " +
                      (mode === m ? "bg-white shadow-sm" : "text-slate-500 hover:text-slate-700")
                    }
                    title={m === "demo" ? "Senza backend" : "Usa /api/chat"}
                  >
                    {m === "demo" ? "Demo" : "Live"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm overflow-hidden">
          <div ref={listRef} className="h-[64vh] sm:h-[70vh] overflow-y-auto px-3 sm:px-6 py-6 space-y-4">
            {messages.map((m) =>
              m.role === "assistant" ? (
                <ErumnaBubble key={m.id} avatarUrl={avatarUrl} text={m.text} ts={m.ts} />
              ) : (
                <UserBubble key={m.id} text={m.text} ts={m.ts} />
              )
            )}
            {isSending && <TypingBubble avatarUrl={avatarUrl} />}
          </div>

          <div className="border-t border-slate-200 bg-white/90 backdrop-blur px-3 sm:px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder="Scribe Latine… (Invio per inviare, Shift+Invio per andare a capo)"
                className="flex-1 resize-none rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-4 py-3 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700 transition"
                aria-label="Invia messaggio"
              >
                <SendIcon />
                Invia
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        Prototipo UI · In modalità Demo non vengono inviati dati al server
      </footer>
    </div>
  );
}

function ErumnaBubble({ avatarUrl, text, ts }: { avatarUrl: string; text: string; ts: Date }) {
  return (
    <div className="flex items-start gap-3 max-w-[88%]">
      <div className="shrink-0 w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-slate-200">
        <img src={avatarUrl} alt="Erumna" className="w-full h-full object-cover" />
      </div>
      <div className="relative">
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 shadow-sm">
          <p className="leading-relaxed">
            <span className="font-semibold">Erumna:</span> {text}
          </p>
        </div>
        <div className="absolute -left-1 top-2 w-2 h-2 bg-slate-100 rotate-45 shadow-sm" />
        <time className="mt-1 block text-[10px] text-slate-400">{ts.toLocaleTimeString()}</time>
      </div>
    </div>
  );
}

function UserBubble({ text, ts }: { text: string; ts: Date }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%]">
        <div className="relative">
          <div className="rounded-2xl rounded-tr-sm bg-sky-600 text-white px-4 py-3 shadow-sm">
            <p className="leading-relaxed">{text}</p>
          </div>
          <div className="absolute -right-1 top-2 w-2 h-2 bg-sky-600 rotate-45 shadow-sm" />
        </div>
        <time className="mt-1 block text-right text-[10px] text-slate-400">{ts.toLocaleTimeString()}</time>
      </div>
    </div>
  );
}

function TypingBubble({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[88%]">
      <div className="shrink-0 w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-slate-200">
        <img src={avatarUrl} alt="Erumna" className="w-full h-full object-cover" />
      </div>
      <div className="relative">
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <Dot /> <Dot className="animation-delay-150" /> <Dot className="animation-delay-300" />
          </div>
        </div>
        <div className="absolute -left-1 top-2 w-2 h-2 bg-slate-100 rotate-45 shadow-sm" />
      </div>
    </div>
  );
}

function Dot({ className = "" }) {
  return (
    <span
      className={"inline-block w-2 h-2 rounded-full bg-slate-400 animate-bounce " + className}
      aria-hidden
    />
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 11L21 3L13 21L11 13L3 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

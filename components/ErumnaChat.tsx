'use client';

import { useEffect, useRef, useState } from "react";

type Msg = { id: number; role: "user" | "assistant"; text: string; ts: Date };

export default function ErumnaChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("server");
      const data = await res.json();
      const replyText = typeof data?.reply === "string" ? data.reply : "(Servizio non disponibile)";
      const botMsg: Msg = { id: Date.now() + 1, role: "assistant", text: replyText, ts: new Date() };
      setMessages((m) => [...m, botMsg]);
    } catch {
      const botMsg: Msg = { id: Date.now() + 2, role: "assistant", text: "(Errore di comunicazione)", ts: new Date() };
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
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-slate-200">
            <img src="/erumna-placeholder.svg" alt="Erumna avatar" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-semibold text-lg">Erumna</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm overflow-hidden">
          <div ref={listRef} className="h-[64vh] overflow-y-auto px-3 sm:px-6 py-6 space-y-4">
            {messages.map((m) =>
              m.role === "assistant" ? (
                <div key={m.id} className="flex items-start gap-3 max-w-[88%]">
                  <div className="shrink-0 w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-slate-200">
                    <img src="/erumna-placeholder.svg" alt="Erumna" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative">
                    <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 shadow-sm">
                      <p className="leading-relaxed"><span className="font-semibold">Erumna:</span> {m.text}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[88%]">
                    <div className="relative">
                      <div className="rounded-2xl rounded-tr-sm bg-sky-600 text-white px-4 py-3 shadow-sm">
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-slate-200 bg-white/90 px-3 sm:px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder="Scribe Latine…"
                className="flex-1 resize-none rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 text-white px-4 py-3 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700 transition"
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

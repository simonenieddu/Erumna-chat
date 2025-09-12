# Erumna · Latina Chat (Vercel)

Interfaccia chat moderna (stile fumetto) + landing page con avatar circolare. Pronta per Vercel.

## Requisiti
- Node 18+
- Un endpoint backend che accetti `POST` JSON `{ "message": "..." }` e risponda `{ "reply": "..." }`.
  - Esempio: `chatbot.php` su Altervista già presente nel tuo progetto.

## Avvio locale
```bash
npm install
npm run dev
# apri http://localhost:3000
```

## Deploy su Vercel (passi rapidi)
1. Crea un nuovo repository su GitHub (es. `erumna-chat`).
2. Carica questi file (o fai `git init`, `git add -A`, `git commit -m "init"`, `git remote add origin ...`, `git push -u origin main`).
3. Su Vercel: **New Project** → Importa il repo GitHub.
4. In **Settings → Environment Variables**, aggiungi:
   - `BACKEND_URL` = URL completo del tuo endpoint (es. `https://tuonome.altervista.org/chatbot.php`).
5. Deploy.

> Se `BACKEND_URL` non è impostato o non risponde, l'API `/api/chat` usa un **fallback demo** in latino.

## Come cambiare l'immagine di Erumna
- Sostituisci `public/erumna-placeholder.svg` con la tua immagine (meglio quadrata).
- Oppure, nella pagina chat, incolla un URL esterno nel campo **Avatar URL** (in alto a destra).

## Struttura
- `app/page.tsx` → Landing page con testo (Latino + Italiano) e bottone “Apri la chat”
- `app/chat/page.tsx` → Pagina chat
- `components/ErumnaChat.tsx` → Componente UI (fumetto, demo/live toggle)
- `app/api/chat/route.ts` → Proxy all'endpoint PHP (Altervista) tramite `BACKEND_URL`

## Integrazione con il tuo PHP esistente
Il client invia a `/api/chat`; la route server legge `process.env.BACKEND_URL` e inoltra la richiesta al tuo `chatbot.php`.
Assicurati che `chatbot.php` accetti `POST` JSON e risponda `{"reply":"..."}`.

## Personalizzazione rapida
- Colori/stile: modifica le classi Tailwind nel componente o in `app/globals.css`.
- Testo landing: cambia i blocchi in `app/page.tsx`.

Buon lavoro! ✦

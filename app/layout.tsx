import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erumna_Bot",
  description: "Chatbot per il latino",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

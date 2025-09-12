import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erumna · Latina Chat",
  description: "Chatbot latino con interfaccia a fumetti, pulita e reattiva",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

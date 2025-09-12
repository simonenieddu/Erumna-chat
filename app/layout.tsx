import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erumna · Latina Chat",
  description: "Chatbot latino con interfaccia moderna a fumetti",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

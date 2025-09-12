import dynamic from "next/dynamic";

const ErumnaChat = dynamic(() => import("../../components/ErumnaChat"), { ssr: false });

export default function ChatPage() {
  return (
    <main className="min-h-screen">
      <ErumnaChat />
    </main>
  );
}

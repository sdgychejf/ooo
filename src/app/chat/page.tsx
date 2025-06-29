import { ChatDashboard } from "@/components/chat";

export default function ChatPage() {
  const apiKey = process.env.NEXT_PUBLIC_QANYTHING_API_KEY || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatDashboard apiKey={apiKey} />
    </div>
  );
}

export const metadata = {
  title: "对话 - QAnything",
  description: "与您的知识库和Agent进行对话",
};

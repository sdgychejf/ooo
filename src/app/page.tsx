import KnowledgeBaseDashboard from "@/components/knowledge-base/knowledge-base-dashboard";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_QANYTHING_API_KEY || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <KnowledgeBaseDashboard apiKey={apiKey} />
    </div>
  );
}

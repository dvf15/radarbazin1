import Link from "next/link";
import HistoryCharts from "@/components/HistoryCharts";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-16">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-white">Histórico</h1>
        <Link href="/" className="text-sm font-semibold text-blue-400">
          ← Voltar
        </Link>
      </div>
      <HistoryCharts />
    </main>
  );
}

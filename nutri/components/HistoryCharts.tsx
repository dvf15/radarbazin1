"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Row {
  date: string;
  label: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  meta_kcal: number;
  meta_protein: number;
  meta_carb: number;
  meta_fat: number;
  training_type: string;
  closed: boolean;
}

const COLORS = { kcal: "#a78bfa", protein: "#34d399", carb: "#fb923c", fat: "#f87171", meta: "#334155" };
const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};
const axisTick = { fontSize: 10, fill: "#64748b" };

export default function HistoryCharts() {
  const [days, setDays] = useState(14);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const r = await fetch(`/api/history?days=${days}`, { cache: "no-store" });
      const j = await r.json();
      if (active) {
        setRows(j.days || []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [days]);

  const last7 = rows.slice(-7);
  const avg = (k: keyof Row) =>
    last7.length ? Math.round(last7.reduce((a, r) => a + (r[k] as number), 0) / last7.length) : 0;
  const macroCmp = [
    { macro: "Proteína", Realizado: avg("protein_g"), Meta: avg("meta_protein") },
    { macro: "Carbo", Realizado: avg("carb_g"), Meta: avg("meta_carb") },
    { macro: "Gordura", Realizado: avg("fat_g"), Meta: avg("meta_fat") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              days === d ? "bg-blue-600 text-white" : "border border-slate-700 bg-slate-800 text-slate-300"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-500">Carregando...</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-500">
          Sem dias registrados ainda.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Calorias vs meta</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rows}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b55" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="kcal" fill={COLORS.kcal} radius={[4, 4, 0, 0]} name="Realizado" />
                <Bar dataKey="meta_kcal" fill={COLORS.meta} radius={[4, 4, 0, 0]} name="Meta" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Macros ao longo do tempo (g)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rows}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="protein_g" stroke={COLORS.protein} dot={false} name="Proteína" />
                <Line dataKey="carb_g" stroke={COLORS.carb} dot={false} name="Carbo" />
                <Line dataKey="fat_g" stroke={COLORS.fat} dot={false} name="Gordura" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">
              Realizado vs meta por macro (média 7d)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={macroCmp}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="macro" tick={axisTick} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b55" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Realizado" fill={COLORS.protein} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Meta" fill={COLORS.meta} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Dias</div>
            <div className="divide-y divide-slate-800">
              {rows
                .slice()
                .reverse()
                .map((r) => (
                  <div key={r.date} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <span className="text-slate-200">{r.label}</span>{" "}
                      <span className="text-[11px] text-slate-500">
                        {r.training_type}
                        {r.closed ? " · fechado" : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold" style={{ color: COLORS.kcal }}>
                        {r.kcal}
                      </span>{" "}
                      <span className="text-[11px] text-slate-500">
                        P{r.protein_g}/C{r.carb_g}/G{r.fat_g}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

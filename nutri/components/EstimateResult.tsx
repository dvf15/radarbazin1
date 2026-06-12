"use client";

import type { Estimate } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/flags";

export default function EstimateResult({
  value,
  onChange,
  onConfirm,
  onDiscard,
  saving,
}: {
  value: Estimate;
  onChange: (v: Estimate) => void;
  onConfirm: () => void;
  onDiscard: () => void;
  saving: boolean;
}) {
  const set = (k: "kcal" | "protein_g" | "carb_g" | "fat_g", v: number) =>
    onChange({ ...value, [k]: v });

  const field = (k: "kcal" | "protein_g" | "carb_g" | "fat_g", label: string) => (
    <div>
      <label className="block text-[10px] uppercase text-slate-500">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        value={value[k]}
        onChange={(e) => set(k, Math.round(Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-slate-900 outline-none"
      />
    </div>
  );

  const conf = value.confidence;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-bold text-slate-900">{value.description}</div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            conf >= 7 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          confiança {conf}/10
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {field("kcal", "kcal")}
        {field("protein_g", "Prot")}
        {field("carb_g", "Carb")}
        {field("fat_g", "Gord")}
      </div>

      {value.flags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {value.flags.map((f) => {
            const m = FLAG_LABELS[f];
            return (
              <span
                key={f}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  m?.tone === "good"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {m?.label || f}
              </span>
            );
          })}
        </div>
      )}

      {value.uncertainties.length > 0 && (
        <ul className="mt-3 space-y-1">
          {value.uncertainties.map((u, i) => (
            <li key={i} className="text-[11px] text-slate-500">
              🔍 {u}
            </li>
          ))}
        </ul>
      )}

      {value.questions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {value.questions.map((q, i) => (
            <li key={i} className="text-[11px] text-blue-600">
              ❓ {q}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          disabled={saving}
          onClick={onConfirm}
          className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Salvando..." : "✓ Salvar no diário"}
        </button>
        <button
          disabled={saving}
          onClick={onDiscard}
          className="rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-600 disabled:opacity-50"
        >
          Descartar
        </button>
      </div>
    </div>
  );
}

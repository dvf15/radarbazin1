"use client";

import type { MealDTO } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/flags";

export default function MealCard({
  meal,
  onDelete,
}: {
  meal: MealDTO;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
              {meal.code}
            </span>
            <span className="truncate text-sm font-semibold text-slate-100">
              {meal.description}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            P {Math.round(meal.protein_g)}g · C {Math.round(meal.carb_g)}g · G{" "}
            {Math.round(meal.fat_g)}g
          </div>
          {meal.confidence < 7 && (
            <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              ⚠️ estimativa incerta ({meal.confidence}/10)
            </span>
          )}
          {meal.flags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {meal.flags.map((f) => {
                const m = FLAG_LABELS[f];
                return (
                  <span
                    key={f}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      m?.tone === "good"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {m?.label || f}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-base font-extrabold" style={{ color: "#a78bfa" }}>
            {Math.round(meal.kcal)}
          </span>
          <button
            onClick={() => onDelete(meal.id)}
            aria-label="Remover refeição"
            className="h-7 w-7 rounded-md border border-slate-700 bg-slate-950 text-slate-400"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

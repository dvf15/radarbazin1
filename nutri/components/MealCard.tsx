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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {meal.code}
            </span>
            <span className="truncate text-sm font-semibold text-slate-800">
              {meal.description}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            P {Math.round(meal.protein_g)}g · C {Math.round(meal.carb_g)}g · G{" "}
            {Math.round(meal.fat_g)}g
          </div>
          {meal.confidence < 7 && (
            <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
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
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-base font-extrabold" style={{ color: "#7C3AED" }}>
            {Math.round(meal.kcal)}
          </span>
          <button
            onClick={() => onDelete(meal.id)}
            aria-label="Remover refeição"
            className="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-400"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

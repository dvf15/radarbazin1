"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { DayDTO, TrainingType } from "@/lib/types";
import { TRAINING_LABELS } from "@/lib/targets";
import MacroProgress from "./MacroProgress";
import MealCard from "./MealCard";
import MealLogger from "./MealLogger";
import TrainingSelector from "./TrainingSelector";

const COLORS = {
  kcal: "#7C3AED",
  protein: "#16A34A",
  carb: "#EA580C",
  fat: "#DC2626",
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}
function shift(date: string, days: number) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
}
function labelFor(date: string) {
  const d = new Date(date + "T12:00:00");
  if (date === todayKey())
    return "Hoje · " + d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const s = d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function DayDashboard() {
  const [date, setDate] = useState(todayKey());
  const [day, setDay] = useState<DayDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchDay = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/day/${d}`, { cache: "no-store" });
      setDay(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDay(date);
  }, [date, fetchDay]);

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  }

  async function setTraining(t: TrainingType) {
    const r = await fetch("/api/day/training", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, training_type: t }),
    });
    if (r.ok) setDay(await r.json());
  }

  async function delMeal(id: string) {
    const r = await fetch(`/api/meals/${id}`, { method: "DELETE" });
    if (r.ok) setDay(await r.json());
  }

  async function closeDay() {
    const willClose = !day?.closed;
    const r = await fetch("/api/day/close", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, closed: willClose }),
    });
    if (r.ok) {
      setDay(await r.json());
      flash(willClose ? "Dia fechado ✓" : "Dia reaberto");
    }
  }

  const isToday = date === todayKey();

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">NutriTreino</h1>
          <p className="text-sm text-slate-500">Diário do Daniel</p>
        </div>
        <Link
          href="/history"
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
        >
          📈 Histórico
        </Link>
      </header>

      {/* Data + treino */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setDate(shift(date, -1))}
            className="h-9 w-10 rounded-lg border border-slate-200 bg-white text-slate-600"
          >
            ‹
          </button>
          <div className="flex-1 text-center text-sm font-bold text-slate-900">{labelFor(date)}</div>
          <button
            onClick={() => !isToday && setDate(shift(date, 1))}
            disabled={isToday}
            className="h-9 w-10 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          >
            ›
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500">Treino do dia</span>
          <TrainingSelector
            value={day?.training_type ?? "rest"}
            onChange={setTraining}
            disabled={loading}
          />
        </div>
      </div>

      {/* Progresso */}
      {day && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <MacroProgress label="Calorias" value={day.totals.kcal} target={day.targets.kcal} unit="" accent={COLORS.kcal} />
          <MacroProgress label="Proteína" value={day.totals.protein_g} target={day.targets.protein_g} unit="g" accent={COLORS.protein} />
          <MacroProgress label="Carboidrato" value={day.totals.carb_g} target={day.targets.carb_g} unit="g" accent={COLORS.carb} />
          <MacroProgress label="Gordura" value={day.totals.fat_g} target={day.targets.fat_g} unit="g" accent={COLORS.fat} />
        </div>
      )}

      {/* Saldo */}
      {day && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Restante até o teto</span>
            <span className="font-bold text-slate-900">{Math.round(day.remaining.kcal)} kcal</span>
          </div>
          <div className="text-[11px] text-slate-400">
            P {Math.round(day.remaining.protein_g)}g · C {Math.round(day.remaining.carb_g)}g · G{" "}
            {Math.round(day.remaining.fat_g)}g · meta {day.targets.kcal[0]}–{day.targets.kcal[1]} kcal
            ({TRAINING_LABELS[day.training_type]})
          </div>
        </div>
      )}

      {/* Flags automáticas */}
      {day && day.flags.length > 0 && (
        <div className="mb-4 space-y-2">
          {day.flags.map((f, i) => (
            <div
              key={i}
              className={`rounded-xl border px-3 py-2 text-sm ${
                f.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {f.message}
            </div>
          ))}
        </div>
      )}

      {/* Logger / botão */}
      {logging && day ? (
        <div className="mb-4">
          <MealLogger
            day={day}
            onSaved={(d) => {
              setDay(d);
              setLogging(false);
              flash("Refeição salva ✓");
            }}
            onClose={() => setLogging(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setLogging(true)}
          disabled={!day}
          className="mb-4 w-full rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-sm disabled:opacity-50"
        >
          + Registrar refeição
        </button>
      )}

      {/* Refeições */}
      <div className="space-y-2">
        {loading && !day && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-400">
            Carregando...
          </div>
        )}
        {day && day.meals.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-400">
            Nenhuma refeição registrada neste dia.
          </div>
        )}
        {day?.meals.map((m) => (
          <MealCard key={m.id} meal={m} onDelete={delMeal} />
        ))}
      </div>

      {/* Fechar o dia */}
      {day && day.meals.length >= 3 && (
        <button
          onClick={closeDay}
          className={`mt-4 w-full rounded-2xl py-3 text-sm font-bold shadow-sm ${
            day.closed
              ? "border border-slate-200 bg-white text-slate-600"
              : "bg-blue-600 text-white"
          }`}
        >
          {day.closed ? "Reabrir o dia" : "Fechar o dia"}
        </button>
      )}

      {toast && (
        <div className="fixed inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}

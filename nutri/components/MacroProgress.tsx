"use client";

import { macroStatus } from "@/lib/macros";

const BAR = {
  good: "bg-emerald-500",
  under: "bg-amber-400",
  over: "bg-rose-500",
} as const;

export default function MacroProgress({
  label,
  value,
  target,
  unit,
  accent,
}: {
  label: string;
  value: number;
  target: [number, number];
  unit: string;
  accent: string;
}) {
  const status = macroStatus(value, target);
  const [min, max] = target;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>
          {label}
        </span>
        <span className="text-xs font-bold text-slate-200">
          {Math.round(value)}
          <span className="text-slate-500">
            /{max}
            {unit}
          </span>
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${BAR[status]}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[10px] text-slate-500">
        alvo {min}–{max}
        {unit}
      </div>
    </div>
  );
}

"use client";

import { TRAINING_TYPES, TRAINING_LABELS } from "@/lib/targets";
import type { TrainingType } from "@/lib/types";

export default function TrainingSelector({
  value,
  onChange,
  disabled,
}: {
  value: TrainingType;
  onChange: (t: TrainingType) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as TrainingType)}
      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-white outline-none disabled:opacity-50"
    >
      {TRAINING_TYPES.map((t) => (
        <option key={t} value={t}>
          {TRAINING_LABELS[t]}
        </option>
      ))}
    </select>
  );
}

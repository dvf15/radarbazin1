"use client";

import { useRef, useState } from "react";
import type { DayDTO, Estimate } from "@/lib/types";
import { fileToResizedDataUrl, splitDataUrl } from "@/lib/image";
import EstimateResult from "./EstimateResult";

export default function MealLogger({
  day,
  onSaved,
  onClose,
}: {
  day: DayDTO;
  onSaved: (d: DayDTO) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file?: File) {
    if (!file) return;
    setErr(null);
    try {
      setDataUrl(await fileToResizedDataUrl(file));
    } catch {
      setErr("Não consegui ler a imagem.");
    }
  }

  async function estimateMeal() {
    setErr(null);
    if (!text.trim() && !dataUrl) {
      setErr("Tire/escolha uma foto ou descreva a refeição.");
      return;
    }
    setLoading(true);
    setEstimate(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        text: text.trim() || undefined,
        dayContext: {
          trainingType: day.training_type,
          totals: day.totals,
          remaining: day.remaining,
        },
      };
      if (dataUrl) {
        const { media_type, data } = splitDataUrl(dataUrl);
        payload.imageBase64 = data;
        payload.imageMediaType = media_type;
      }
      const r = await fetch("/api/meals/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao estimar.");
      setEstimate(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao estimar.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!estimate) return;
    setSaving(true);
    setErr(null);
    try {
      const r = await fetch("/api/meals/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date: day.date,
          description: estimate.description,
          photo_url: dataUrl,
          kcal: estimate.kcal,
          protein_g: estimate.protein_g,
          carb_g: estimate.carb_g,
          fat_g: estimate.fat_g,
          confidence: estimate.confidence,
          flags: estimate.flags,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao salvar.");
      onSaved(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao salvar.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Registrar refeição
        </div>
        <button onClick={onClose} className="text-sm text-slate-400">
          Fechar
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0] || undefined)}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-700"
      >
        📷 Tirar / escolher foto
      </button>

      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="prévia da refeição"
          className="mt-3 max-h-56 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
        />
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ou descreva: 2 ovos, 100g arroz, 150g frango grelhado"
        className="mt-3 min-h-[64px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400"
      />

      <button
        onClick={estimateMeal}
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? "Analisando..." : "Estimar macros"}
      </button>

      {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}

      {estimate && (
        <EstimateResult
          value={estimate}
          onChange={setEstimate}
          onConfirm={save}
          onDiscard={() => setEstimate(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

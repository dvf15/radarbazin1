// Utilidades de imagem no cliente: redimensiona a foto antes de enviar à IA
// para reduzir custo/tokens e evitar payloads gigantes.

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao ler a imagem."));
    img.src = src;
  });
}

export async function fileToResizedDataUrl(
  file: File,
  maxSide = 1024,
  quality = 0.8
): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível.");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function splitDataUrl(dataUrl: string): { media_type: string; data: string } {
  const m = dataUrl.match(/^data:(.+?);base64,(.*)$/);
  return m ? { media_type: m[1], data: m[2] } : { media_type: "image/jpeg", data: dataUrl };
}

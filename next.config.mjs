/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fotos chegam como base64 e são redimensionadas no cliente; aumentamos o
  // limite do body das Server Actions/route handlers para acomodar imagens.
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  // App pessoal: não bloquear o build por avisos de lint (ex.: <img>).
  // Erros de TypeScript continuam falhando o build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

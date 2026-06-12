# NutriTreino — Diário nutricional do Daniel

App que substitui o meal logging feito no chat: o histórico fica no banco e cada
chamada à IA usa só **perfil + dia atual** (contexto mínimo). Registre refeições
por **foto** ou **texto**, a IA (Claude) estima os macros, você confirma/edita e
salva. Dashboard com totais, saldo, flags automáticas e histórico com gráficos.

## Stack

Next.js 14 (App Router) · Tailwind · Prisma + SQLite · Anthropic SDK
(`claude-sonnet-4-6`) · Recharts.

## Rodar localmente

```bash
cd nutri
cp .env.example .env          # e preencha ANTHROPIC_API_KEY
npm install
npm run setup                 # prisma db push + seed (cria dev.db)
npm run dev                   # http://localhost:3000
```

> A `ANTHROPIC_API_KEY` (começa com `sk-ant-`) vem do console.anthropic.com e
> fica no `.env` (nunca é exposta ao navegador — a IA é chamada no servidor).

## Usar no celular (mesma rede Wi‑Fi)

O `npm run dev` já sobe o servidor escutando na rede (`-H 0.0.0.0`). Para abrir no
celular:

1. No computador, descubra o IP local:
   - **Windows:** `ipconfig` → "Endereço IPv4" (ex.: `192.168.0.12`)
   - **macOS/Linux:** `ipconfig getifaddr en0` ou `hostname -I`
2. Deixe `npm run dev` rodando no computador.
3. No celular (mesmo Wi‑Fi), abra `http://SEU_IP:3000` (ex.: `http://192.168.0.12:3000`).
4. Menu do navegador → **"Adicionar à Tela de Início"** → vira um app com ícone.

> O computador precisa estar ligado e na mesma rede — o celular é só a "tela".
> Para usar fora de casa, faça o deploy (Postgres + Vercel); veja o fim deste README.

## Estrutura

```
app/
  page.tsx                 Dashboard do dia
  history/page.tsx         Histórico + gráficos
  api/
    meals/estimate         POST  foto/texto -> macros (Claude)
    meals/save             POST  salva refeição
    meals/[id]             DELETE remove refeição
    day/[date]             GET   dia completo (totais, metas, flags)
    day/close              POST  fecha/reabre o dia
    day/training           POST  define o tipo de treino
    history                GET   dias para os gráficos
components/                Dashboard, MealLogger, MacroProgress, charts...
lib/                       targets, macros, prompts, profile, day, image
prisma/                    schema + seed (alimentos com macros fixos)
```

## Metas por tipo de treino

`rest | light | strength | legs | bjj | double` — faixas de kcal/proteína/carbo/
gordura em `lib/targets.ts`. O saldo é calculado contra o **teto** da faixa.

## Flags automáticas

- ⚠️ gordura saturada concentrada (atenção ao LDL)
- ⚠️ carbo baixo p/ treino pesado (BJJ/duplo/perna)
- ⚠️ déficit agressivo em dia de treino pesado
- ✅ proteína no alvo

## Produção (Postgres)

Troque o `datasource` do `prisma/schema.prisma` para `postgresql`, ajuste
`DATABASE_URL` e rode `prisma migrate deploy`. Deploy recomendado: Vercel.

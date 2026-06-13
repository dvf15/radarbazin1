# NutriTreino — Diário nutricional do Daniel

App que substitui o meal logging feito no chat: o histórico fica no banco e cada
chamada à IA usa só **perfil + dia atual** (contexto mínimo). Registre refeições
por **foto** ou **texto**, a IA (Claude) estima os macros, você confirma/edita e
salva. Dashboard com totais, saldo, flags automáticas e histórico com gráficos.

## Stack

Next.js 14 (App Router) · Tailwind · Prisma + **PostgreSQL** · Anthropic SDK
(`claude-sonnet-4-6`) · Recharts. Tema escuro.

---

## ☁️ Publicar online (não depende do PC ligado) — RECOMENDADO

Resultado: um link que abre no celular de qualquer lugar, 24h, com o PC desligado.
Tudo no plano gratuito. ~10 minutos.

### Passo 1 — Banco PostgreSQL grátis (Neon)
1. Crie conta em **https://neon.tech** (pode entrar com o GitHub).
2. **Create project** → escolha uma região (ex.: AWS São Paulo / us-east).
3. Copie a **Connection string** (começa com `postgresql://...` e termina com
   `?sslmode=require`). Guarde — é o seu `DATABASE_URL`.

### Passo 2 — Deploy na Vercel
1. Crie conta em **https://vercel.com** com o **GitHub**.
2. **Add New… → Project** → importe o repositório `radarbazin1`.
3. Em **Root Directory**, selecione a pasta **`nutri`**. (importante!)
4. Em **Environment Variables**, adicione:
   - `DATABASE_URL` = a connection string do Neon (passo 1)
   - `ANTHROPIC_API_KEY` = sua chave `sk-ant-...` (de console.anthropic.com)
5. **Deploy**. A Vercel roda as migrations sozinha (`vercel-build`) e cria as
   tabelas no Neon.
6. (opcional) Popular a tabela de alimentos conhecidos: no seu PC, com o
   `DATABASE_URL` do Neon no `.env`, rode `npm run db:seed`. Não é obrigatório —
   o app funciona sem isso.

Pronto: a Vercel te dá um link `https://...vercel.app`. Abra no celular →
menu do navegador → **"Adicionar à Tela de Início"** → vira app com ícone.

> Cada `git push` na branch faz a Vercel **redeployar** automaticamente.

---

## 💻 Rodar localmente (opcional, para desenvolver)

Precisa de um PostgreSQL. O mais fácil é reusar o mesmo banco do Neon (ou criar
um projeto/branch separado lá para dev).

```bash
cd nutri
cp .env.example .env          # cole DATABASE_URL (Neon) e ANTHROPIC_API_KEY
npm install
npm run setup                 # aplica migrations + popula alimentos
npm run dev                   # http://localhost:3000 (escuta na rede p/ celular)
```

Para abrir no celular na **mesma rede**: descubra o IP do PC (`ipconfig` no
Windows, `hostname -I` no Linux, `ipconfig getifaddr en0` no Mac) e acesse
`http://SEU_IP:3000`. (Isso é só para dev — para uso real, use o deploy acima.)

> A `ANTHROPIC_API_KEY` é usada **no servidor**, nunca exposta ao navegador.

---

## Estrutura

```
app/
  page.tsx                 Dashboard do dia
  history/page.tsx         Histórico + gráficos
  manifest.ts              PWA (Adicionar à Tela de Início)
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
prisma/                    schema + migrations + seed (alimentos fixos)
```

## Metas por tipo de treino

`rest | light | strength | legs | bjj | double` — faixas de kcal/proteína/carbo/
gordura em `lib/targets.ts`. O saldo é calculado contra o **teto** da faixa.

## Flags automáticas

- ⚠️ gordura saturada concentrada (atenção ao LDL)
- ⚠️ carbo baixo p/ treino pesado (BJJ/duplo/perna)
- ⚠️ déficit agressivo em dia de treino pesado
- ✅ proteína no alvo

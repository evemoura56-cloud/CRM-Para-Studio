# INKHOUSE CRM - Visao Geral

Ecossistema SaaS multi-tenant para estudios de tatuagem. Identidade visual: dark + neon vermelho (#FF0000), tipografia Poppins (titulos) e Inter/Montserrat (texto). Logo: caveira outline neon com glow.

## Arquitetura
- Monorepo leve: `backend/` (API Express), `frontend/` (Vite + React + Tailwind existente na raiz), `mobile/` (Expo/React Native stub), `landing/` (pagina marketing), `database/` (DDL/seed PostgreSQL), `docs/`.
- Multi-tenant via `studio_id` em todas as entidades; JWT carrega `studioId` e `role`.
- Planos SaaS codificados (free/pro/premium) com limites e middlewares simples.
- Pagamentos simulados via callbacks e status na tabela `subscriptions`.

## Banco de Dados
- Escolha: **PostgreSQL** (suporte a JSONB, extensao pgcrypto para UUID e bom para multi-tenant).
- DDL e seeds: `database/schema.sql` (gera 5 estudios, 15 clientes por estudio, 10 sessoes por estudio, assinaturas e configuracoes).
- Rodar local: `psql -U postgres -f database/schema.sql` (garanta a extensao `pgcrypto`).  
- Usuarios seed usam hash de `inkhouse123`.

## Backend (Express)
- Local dev: `cd backend && npm install && npm run dev` (porta 4000).
- Variaveis: `JWT_SECRET` (opcional).
- Principais rotas (todas documentadas em `docs/api.md`):  
  - `POST /auth/register-studio` cria estudio + owner em trial.  
  - `POST /auth/login` retorna JWT.  
  - `GET/POST/PUT /clients` clientes do estudio com filtros e limite de plano.  
  - `GET/POST /sessions` cria sessoes e atualiza status/metricas.  
  - `GET /dashboard` resumo (clientes, fidelizados, agendados, receita, media tattoos).  
  - `GET/PUT /settings` neon, brilho, lembretes WhatsApp.  
  - `GET/POST /subscriptions` upgrade/callback simulado.  
  - `GET /admin/studios` e `GET /admin/activity-logs` (admin_master).
- Middlewares: `authenticate`, `requireTenant`, `requireRole`, `requirePlan` (lógica de planos).

## Frontend Web
- App Vite/Tailwind ja presente na raiz (`src/` etc). Rodar: `npm install && npm run dev`.  
- Pagineamento: Login -> Clientes, Retornos, Kanban, Fidelizados, VIP, Configuracoes. Estilo dark neon seguindo mockups.

## Mobile (Expo stub)
- Pasta `mobile/` com `App.tsx` focado em agenda e clientes.  
- Rodar: `cd mobile && npm install && npx expo start`. Tokens JWT da API backend.

## Landing Page
- Pasta `landing/` com `index.html` estatico (tema neon) com hero, seçoes e CTA de trial. Pode servir via `npx serve landing` ou hospedar direto.

## Usuarios de teste
- Admin master: `admin@inkhouse.cloud` / `inkhouse123` (somente admin routes).  
- Owners/Artists/Assistants por estudio: `owner@<slug>.ink`, `artist@<slug>.ink`, `assistant@<slug>.ink` com senha `inkhouse123` (`slug`: skullking, blackrose, nightowl, crimsonlab, voidwalker).  
- Tokens carregam `studioId` e `role`.

## Limitacoes e proximos passos
- Backend usa store em memoria; conectar ao PostgreSQL usando Prisma ou Sequelize para persistencia real.  
- Exportacoes CSV/PDF e push/mobile ainda simulados.  
- Web frontend nao consome API ainda (mock local); precisa integrar com endpoints e estado global.  
- Jobs diarios (inativar >6 meses) representados por logica em `enforceClientStatus`; ideal criar cron real.  
- Autenticacao mobile/landing simplificada; ajustar fluxo de trial/pagamento quando integrar gateway real.

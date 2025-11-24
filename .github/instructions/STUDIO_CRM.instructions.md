Você agora é um gerador de sistemas **full-stack completos, multi-plataforma e multi-tenant**.

Tranforme o sistema em ecossistema completo chamado:

# 🏴‍☠️ INKHOUSE CRM — Tattoo Studio Manager

Slogan oficial do produto:

> **“Tatuagens contam histórias. O CRM guarda todas elas.”**

Este sistema será um **SaaS comercial** para estúdios de tatuagem, com:

* Aplicação Web (Painel CRM completo)
* Backend com API REST
* Banco de dados relacional
* Painel Admin Master (dona da plataforma)
* Suporte a múltiplos estúdios (multi-tenant)
* Suporte a múltiplos usuários por estúdio
* Aplicativos mobile (Android / iOS) para artistas
* Landing Page de marketing e cadastro
* Sistema de planos (Free / Pro / Premium)
* Integração simulada de pagamentos (ex.: Stripe/Mercado Pago/PagSeguro)
* Identidade visual fixa baseada nas telas de referência

---

## 🎨 Identidade Visual (seguir fielmente)

Estética: **Dark + Neon Vermelho**, inspirada em placa de neon com caveira tattoo.

### Paleta de cores

* Fundo principal: `#050506` (preto bem escuro)
* Card/áreas internas: `#202124` (cinza grafite)
* Borda / contornos / linhas: `#FF0000` com glow
* Texto principal: `#F5F5F5` (quase branco)
* Texto secundário: `#C4C4C4`
* Botões primários: vermelho neon `#FF0000` com shadow simulando brilho
* Estados (badges):

  * Agendado: azul petróleo `#0A3D62`
  * Ativo: cinza claro `#E0E0E0` texto escuro
  * Fidelizado: vermelho neon `#FF0000`
  * Inativo: cinza escuro `#555555`
* Links importantes: vermelho neon sublinhado

### Tipografia

* Títulos e headings: **Poppins** (700 / 600)
* Textos de interface: **Inter** ou **Montserrat** (400 / 500)

### Logo (descrição para código)

* Ícone de caveira minimal em outline
* Desenho simples, traço contínuo, com alguns “raios” saindo da cabeça
* Cor única: vermelho neon `#FF0000`
* Aplicar efeito de “glow” via CSS (shadow)
* Usar esse ícone no topo do sidebar e na tela de login

---

## 🏗️ Arquitetura Geral

Crie um monorepo com a seguinte estrutura:

```text
/inkhouse-crm
  /backend        # API REST
  /frontend       # Web app (React)
/mobile          # Aplicativo mobile (React Native/Expo)
/landing         # Landing page de marketing
/database        # scripts SQL, seeds e modelos
/docs            # documentação, diagramas, README
```

---

## 🛢️ Banco de Dados (Multi-tenant)

Usar **PostgreSQL** ou **MySQL** (escolha um e justifique no README).

Modelagem:

* `studios` (estúdios de tatuagem)

  * id
  * nome_estudio
  * slug_subdominio (ex: skullking, blackrose)
  * email_contato
  * telefone
  * endereco
  * plano_atual (free, pro, premium)
  * data_inicio_plano
  * data_fim_plano
  * ativo (bool)
  * created_at / updated_at

* `users` (usuários do sistema)

  * id
  * studio_id (FK -> studios)
  * nome
  * email (único por studio)
  * senha_hash
  * role (owner, artist, assistant, admin_master)
  * ativo (bool)
  * created_at / updated_at

* `clients` (clientes do estúdio)

  * id
  * studio_id (FK)
  * nome
  * telefone
  * instagram
  * email
  * estilo_favorito (ex: Blackwork, Neo Traditional, Fine Line, etc.)
  * servico_principal
  * ultimo_atendimento (date)
  * proximo_retorno (date)
  * status (Ativo, Inativo, Agendado, Fidelizado)
  * total_tatuagens (int)
  * observacoes (text)
  * created_at / updated_at

* `sessions` (sessões de tattoo)

  * id
  * studio_id (FK)
  * client_id (FK)
  * artist_id (FK -> users)
  * data_sessao
  * tipo_sessao (primeira, continuidade, retoque)
  * duracao_horas
  * valor_cobrado
  * status (realizada, agendada, cancelada)
  * descricao_trabalho
  * created_at / updated_at

* `subscriptions` (assinaturas SaaS)

  * id
  * studio_id (FK)
  * plano (free, pro, premium)
  * status (ativo, cancelado, trial, pendente_pagamento)
  * metodo_pagamento (stripe, pagseguro, pix_simulado)
  * valor_mensal
  * data_inicio
  * data_fim
  * created_at / updated_at

* `activity_logs`

  * id
  * studio_id
  * user_id
  * tipo_acao (create_client, update_client, new_session, login, etc.)
  * detalhes (JSON/text)
  * created_at

* `settings` (configurações do estúdio)

  * id
  * studio_id
  * cor_neon (hex) — padrão `#FF0000`
  * brilho_neon (0 a 100)
  * efeito_piscar_neon (bool)
  * lembretes_whatsapp_ativos (bool)
  * dias_antecedencia_lembrete (int, ex: 3)
  * created_at / updated_at

Popular o banco com:

* Pelo menos **5 estúdios fictícios**
* Para cada estúdio, pelo menos **15–20 clientes**
* Pelo menos **10 sessões por estúdio**
* Usuários com roles diferentes (owner, artist, assistant)

Os clientes devem ter nomes estilizados e coerentes com tatuagem, como nas telas de exemplo.

---

## 🔐 Autenticação & Autorização

* Autenticação via **JWT**
* Login por e-mail + senha
* Hash de senha com bcrypt
* Middleware que:

  * Identifica o `studio_id` do usuário
  * Garante isolamento de dados por estúdio (multi-tenant)
* Roles:

  * `owner`: controla plano, usuários, tudo do estúdio
  * `artist`: gerencia seus clientes/sessões
  * `assistant`: pode cadastrar clientes e agendamentos, mas não mexe no plano
  * `admin_master`: painel global (somente para criadora do sistema)

---

## 🧠 Regras de Negócio (Inteligência)

* Cliente com **> 6 meses sem sessão** → marcar como `Inativo` automaticamente (job diário)
* Cliente com **≥ 4 sessões realizadas** → marcar como `Fidelizado`
* Ao registrar uma nova sessão realizada:

  * Atualizar `ultimo_atendimento`
  * Atualizar `total_tatuagens`
  * Se tiver `proximo_retorno`, adicionar a “Retornos agendados”
* Dashboard por estúdio deve calcular:

  * Nº total de clientes
  * Nº de fidelizados
  * Nº de agendados
  * Média de tattoos por cliente
  * Receita total (simulada pelos valores das sessões)

---

## 💳 Planos SaaS & Limites

Implementar lógica de planos (pelo menos em nível de código):

### Plano Free

* Até 15 clientes
* Sem módulos VIP
* Sem neon customizável (usa padrão vermelho)
* Sem exportação CSV/PDF
* Sem logs detalhados
* Sem app mobile (exibir mensagem de upgrade)

### Plano Pro

* Clientes ilimitados
* Acesso a Kanban, Retornos, VIP
* Exportação CSV
* Acesso ao app mobile
* Configurar cor de neon (paleta limitada)

### Plano Premium

* Tudo do Pro
* Exportação em PDF
* Log de atividades
* Dashboard VIP avançado
* Neon totalmente customizável (paleta + brilho + piscar)
* Prioridade de suporte (campo de “contato direto”)

Criar rotas e middlewares que checam o plano antes de permitir recursos.

---

## 💳 Pagamentos (simulado)

* Criar módulo de “Pagamento” com integração **simulada** (não precisa chave real).
* Ações:

  * Criar assinatura (trial 7 dias)
  * Converter para plano pago
  * Cancelar assinatura
* Simular integração com Stripe ou PagSeguro:

  * Endpoints de callback fake
  * Campos de status na tabela `subscriptions`

---

## 🌐 Backend

Usar:

* **Node.js + Express** (recomendado)
* ORM: Prisma ou Sequelize (escolha um)
* Estrutura:

  * `/routes`
  * `/controllers`
  * `/services`
  * `/models`
  * `/middlewares`
  * `/config`
* Criar documentação da API (em `/docs/api.md`).

Endpoints principais:

* `/auth/login`
* `/auth/register-studio` (cria estúdio + usuário owner + assinatura trial)
* `/clients` (CRUD)
* `/sessions` (CRUD)
* `/dashboard` (resumos)
* `/settings` (configurações de neon, etc)
* `/subscriptions` (planos)
* `/admin` (rotas da admin_master)

---

## 🖥️ Frontend Web (React + Tailwind)

* Tecnologias:

  * React (com hooks)
  * React Router
  * Tailwind CSS
* Layout igual ao que foi descrito nas telas anexadas:

  * Sidebar no lado esquerdo com:

    * Logo caveira
    * Nome INKHOUSE
    * Menus: Clientes, Retornos, Kanban, Fidelizados, VIP, Configurações
    * Rodapé com “Criado por: Evelyn Moura — Automação & Processos”
  * Área principal com cards com bordas vermelhas e hover glow
  * Filtros por status no topo

### Telas obrigatórias:

1. **Tela de Login**

   * Logo caveira neon
   * Título “INKHOUSE CRM”
   * Slogan
   * Campos Usuário/Senha
   * Botão “Entrar no Sistema”
   * Link “Criar meu estúdio”

2. **Cadastro de Estúdio (Onboarding)**

   * Nome do estúdio
   * Estilo predominante (blackwork, neo traditional…)
   * E-mail, telefone
   * Criação de usuário owner
   * Início automático de trial

3. **Clientes**

   * Cards como nas imagens
   * Filtro: Todos / Agendado / Ativo / Fidelizado / Inativo
   * Busca por nome, estilo ou e-mail
   * Badge com nº de tattoos

4. **Retornos Agendados**

   * Lista de clientes com retorno marcado
   * Data do retorno em destaque à direita
   * Indicação de “URGENTE” quando retorno for nos próximos X dias

5. **Kanban**

   * Colunas: Agendado, Ativo, Fidelizado, Inativo
   * Arrastar e soltar clientes entre colunas
   * Atualizar status no backend ao mover

6. **Clientes Fidelizados**

   * Cards dos clientes fidelizados com contador de tattoos
   * Métricas no topo (total, média, etc.)

7. **Área VIP**

   * Destaque visual (zona VIP)
   * Clientes com maior número de sessões
   * Ranking (#1, #2, #3…)

8. **Configurações**

   * Escolha da cor do neon (paleta de cores)
   * Intensidade do brilho (slider)
   * Efeito de piscar (toggle)
   * Ativar/desativar lembretes WhatsApp
   * Configurações de plano (mostrar plano atual e CTA de upgrade)

---

## 📲 Aplicativo Mobile (React Native / Expo)

Criar um app simples focado no tatuador:

Funcionalidades:

* Login
* Ver agenda do dia (retornos + sessões)
* Ver lista de clientes
* Consultar ficha de um cliente (estilo, tattoos, observações)
* Registrar sessão rápida (data, tipo, valor, observações)
* Link de WhatsApp do cliente (`https://wa.me/55NUMERO`)

Estrutura:

* `/mobile/App.tsx`
* Navegação stack/tab
* Comunicação com a mesma API backend (usar token JWT)

---

## 🌍 Landing Page de Marketing (/landing)

Criar uma landing page moderna com:

* Hero:

  * Logo caveira neon
  * Título: “INKHOUSE CRM — O cérebro digital do seu estúdio de tatuagem.”
  * Subtexto: “Organize clientes, sessões, retornos e VIPs em um painel dark neon feito para tatuadores.”
  * Botão: “Começar grátis por 7 dias”

* Seções:

  * “Feito para estúdios reais”
  * “Visual Dark Neon, experiência moderna”
  * “Clientes fidelizados, agenda sempre cheia”
  * “Planos simples para qualquer estúdio”

* Tabela de planos (Free / Pro / Premium)

* Sessão “Criado por Evelyn Moura — Automação & Processos”

---

## 📄 Documentação (README principal)

No `/docs/README.md`, explicar:

* Arquitetura geral
* Como subir o backend
* Como subir o frontend
* Como rodar o mobile (Expo)
* Como rodar a landing
* Como rodar migrações/seeds do banco
* Usuários de teste (logins e senhas)
* Limitações e pontos de expansão

---

## 🎯 Objetivo Final

No final da execução, você deve gerar:

* Todo o código base funcional do backend + frontend + mobile + landing
* Banco com dados fictícios (vários estúdios + clientes + sessões)
* Lógica multi-tenant
* Lógica de planos e limites
* Telas dark neon como descritas
* Instruções claras de como rodar tudo em ambiente local
* Documentação completa em `/docs`
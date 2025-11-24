# 🗂️ Estrutura do Projeto INKHOUSE CRM

```
CRM-Para-Studio/
│
├── 📁 .git/                          # Controle de versão Git
│
├── 📁 .github/                       # Configurações GitHub
│   └── instructions/
│       └── STUDIO_CRM.instructions.md
│
├── 📁 public/                        # Assets públicos
│   └── 💀 skull-icon.svg            # Ícone caveira neon (favicon)
│
├── 📁 src/                           # Código fonte
│   │
│   ├── 📁 components/               # Componentes reutilizáveis
│   │   ├── ⚛️ Header.jsx           # Cabeçalho das páginas
│   │   ├── ⚛️ Sidebar.jsx          # Menu lateral de navegação
│   │   └── ⚛️ SkullLogo.jsx        # Logo SVG animado
│   │
│   ├── 📁 data/                     # Dados do sistema
│   │   └── 📊 mockData.js          # 20 clientes mock + cores
│   │
│   ├── 📁 pages/                    # Páginas da aplicação
│   │   ├── 🚪 Login.jsx            # Tela inicial de login
│   │   ├── 📁 Clientes.jsx         # Gestão de clientes
│   │   ├── 🗓️ Retornos.jsx         # Agendamentos
│   │   ├── 🧩 Kanban.jsx           # Board drag-and-drop
│   │   ├── ⭐ Fidelizados.jsx      # Dashboard fidelizados
│   │   ├── 💀 VIP.jsx              # Área premium
│   │   └── ⚙️ Configuracoes.jsx    # Personalizações
│   │
│   ├── ⚛️ App.jsx                   # Componente raiz
│   ├── ⚛️ main.jsx                  # Entry point React
│   └── 🎨 index.css                # Estilos globais + Tailwind
│
├── 📄 .gitignore                    # Arquivos ignorados
├── 📄 index.html                    # HTML base
├── 📄 package.json                  # Dependências e scripts
├── 📄 postcss.config.js            # Config PostCSS
├── 📄 tailwind.config.js           # Config Tailwind (cores neon)
├── 📄 vite.config.js               # Config Vite
│
├── 📖 README.md                     # Documentação principal
├── 📖 INSTALACAO.md                # Guia de instalação
└── 📖 RESUMO_PROJETO.md            # Resumo executivo

```

---

## 🎯 Mapa de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                    🚪 LOGIN                             │
│  - Logo caveira neon animada                            │
│  - Formulário de entrada                                │
│  - Slogan: "Tatuagens contam histórias..."             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 🏠 SISTEMA PRINCIPAL                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────────────┐│
│  │   SIDEBAR    │  │       CONTEÚDO DINÂMICO          ││
│  │              │  │                                  ││
│  │ 💀 Logo      │  │  ┌────────────────────────────┐ ││
│  │              │  │  │         HEADER            │ ││
│  │ 📁 Clientes  │◄─┼─►│  Título da Página Atual   │ ││
│  │ 🗓️ Retornos  │  │  └────────────────────────────┘ ││
│  │ 🧩 Kanban    │  │                                  ││
│  │ ⭐ Fideliz.  │  │  ┌────────────────────────────┐ ││
│  │ 💀 VIP       │  │  │                            │ ││
│  │ ⚙️ Config    │  │  │     Conteúdo da Página     │ ││
│  │              │  │  │                            │ ││
│  │ ────────────│  │  │  - Grid de cards           │ ││
│  │ Criado por:  │  │  │  - Listas                  │ ││
│  │ Evelyn Moura │  │  │  - Kanban board            │ ││
│  └──────────────┘  │  │  - Dashboards              │ ││
│                    │  │  - Formulários             │ ││
│                    │  └────────────────────────────┘ ││
│                    └──────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│ mockData.js │ ◄── 20 clientes fictícios
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│         App.jsx (Estado)            │
│  - isLoggedIn                       │
│  - currentPage                      │
└──────────┬──────────────────────────┘
           │
           ↓
     ┌────┴────┐
     │         │
     ↓         ↓
┌────────┐  ┌──────────────┐
│Sidebar │  │ Páginas      │
└────────┘  └──────┬───────┘
                   │
        ┌──────────┼──────────┬──────────┬─────────┐
        ↓          ↓          ↓          ↓         ↓
    Clientes   Retornos   Kanban   Fidelizados   VIP
        │          │          │          │         │
        └──────────┴──────────┴──────────┴─────────┘
                           │
                           ↓
                    Renderização
```

---

## 🎨 Sistema de Cores

```
┌──────────────────────────────────────────────────────┐
│  PALETA NEON                                         │
├──────────────────────────────────────────────────────┤
│  ███  #0C0C0D  dark-bg         (Fundo principal)     │
│  ███  #FF0000  neon-red        (Destaques)           │
│  ███  #0A3D62  petrol-blue     (Secundária)          │
│  ███  #E6E6E6  ice-gray        (Textos)              │
│  ███  #343434  charcoal-gray   (Bordas/Cards)        │
└──────────────────────────────────────────────────────┘

STATUS:
┌──────────────────────────────────────────────────────┐
│  🟦  #0A3D62  Agendado                               │
│  ⚪  #E6E6E6  Ativo                                   │
│  ❤️   #FF0000  Fidelizado (com glow)                 │
│  ⬛  #343434  Inativo                                 │
└──────────────────────────────────────────────────────┘
```

---

## ⚡ Efeitos Neon Aplicados

```css
/* GLOW PRINCIPAL */
.neon-text {
  text-shadow:
    0 0 5px #FF0000,
    0 0 10px #FF0000,
    0 0 20px #FF0000,
    0 0 40px #FF0000;
}

/* BORDER GLOW */
.neon-border {
  border: 2px solid #FF0000;
  box-shadow:
    0 0 5px #FF0000,
    0 0 10px #FF0000,
    inset 0 0 5px #FF0000;
}

/* BUTTON HOVER */
.neon-button:hover {
  box-shadow:
    0 0 18px #FF0000,
    0 0 30px #FF0000;
  transform: scale(1.05);
}

/* BLINK ANIMATION */
@keyframes neonBlink {
  0%, 19%, 21%, 23%, 25% { opacity: 1; }
  20%, 24% { opacity: 0.4; }
}
```

---

## 🔌 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 📊 Estatísticas do Mock Data

```
TOTAL DE CLIENTES: 20

Por Status:
├── 🟦 Agendado:    3 (15%)
├── ⚪ Ativo:        8 (40%)
├── ❤️  Fidelizado:  7 (35%)
└── ⬛ Inativo:      2 (10%)

Clientes VIP: 9 (45%)

Total de Tatuagens: 165
Média por Cliente: 8.25 tattoos

Estilos mais populares:
1. Blackwork (3 clientes)
2. Realismo (2 clientes)
3. Neo Traditional (2 clientes)
```

---

## 🚀 Scripts NPM

```bash
# Desenvolvimento
npm run dev           # Inicia servidor local

# Produção
npm run build         # Build otimizado
npm run preview       # Preview da build

# Instalação
npm install           # Instala dependências
```

---

## 📱 Responsividade

```
Mobile (375px+)
├── 1 coluna
├── Menu compacto
└── Cards empilhados

Tablet (768px+)
├── 2 colunas
├── Sidebar visível
└── Grid responsivo

Desktop (1024px+)
├── 3-4 colunas
├── Layout completo
└── Máxima visualização
```

---

## 🎯 Páginas x Funcionalidades

```
📁 Clientes
├── Busca em tempo real
├── Filtros por status
├── Modal de detalhes
└── Grid responsivo

🗓️ Retornos
├── Lista cronológica
├── Contador de dias
├── Alertas urgentes
└── Informações completas

🧩 Kanban
├── Drag and drop
├── 4 colunas de status
├── Feedback visual
└── Atualização em tempo real

⭐ Fidelizados
├── Dashboard estatístico
├── Lista ordenada
├── Métricas detalhadas
└── Design especial

💀 VIP
├── Ranking top 3
├── 4 métricas principais
├── Design premium
└── Badges exclusivos

⚙️ Configurações
├── Seletor de cor
├── Slider intensidade
├── Toggle blink
└── Preview ao vivo
```

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  (React Components + Tailwind CSS)      │
├─────────────────────────────────────────┤
│  Login │ Clientes │ Kanban │ VIP │ ...  │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│           APPLICATION LAYER             │
│  (State Management + Routing)           │
├─────────────────────────────────────────┤
│  App.jsx │ useState │ Props │ Hooks     │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│             DATA LAYER                  │
│  (Mock Data + Future API)               │
├─────────────────────────────────────────┤
│  mockData.js (20 clients)               │
│  statusColors                           │
│  Future: API REST                       │
└─────────────────────────────────────────┘
```

---

<div align="center">

## 💀 INKHOUSE CRM

**Estrutura completa e organizada**

*Desenvolvido por Evelyn Moura*

</div>

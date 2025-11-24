# 🚀 Guia de Instalação - INKHOUSE CRM

## ⚠️ Pré-requisitos

Antes de executar o INKHOUSE CRM, você precisa instalar o Node.js.

### Instalar Node.js

1. **Acesse**: https://nodejs.org/
2. **Baixe**: A versão LTS (recomendada)
3. **Execute**: O instalador e siga as instruções
4. **Verifique**: Após a instalação, abra o PowerShell e execute:
   ```powershell
   node --version
   npm --version
   ```

---

## 📦 Instalação do Projeto

### Passo 1: Abrir o Terminal no Diretório do Projeto

```powershell
cd "c:\Users\evems\OneDrive\Documents\GitHub\CRM-Para-Studio"
```

### Passo 2: Instalar Dependências

```powershell
npm install
```

Isso instalará:
- React 18.2
- Vite 5.0
- Tailwind CSS 3.3
- react-beautiful-dnd
- lucide-react
- E todas as outras dependências necessárias

### Passo 3: Iniciar o Servidor de Desenvolvimento

```powershell
npm run dev
```

O sistema abrirá automaticamente no navegador em: **http://localhost:3000**

---

## 🎨 Primeiro Acesso

### Tela de Login

Na primeira tela você verá:
- 💀 Logo da caveira neon animada
- Título "INKHOUSE CRM" com efeito neon
- Slogan: "Tatuagens contam histórias. O CRM guarda todas elas."

**Para entrar**: Digite qualquer usuário e senha (é apenas uma demo)

---

## 🧭 Navegação no Sistema

### Menu Lateral (Sidebar)

- **📁 Clientes**: Listagem completa com busca e filtros
- **🗓️ Retornos**: Próximos agendamentos organizados
- **🧩 Kanban**: Board drag-and-drop para gestão visual
- **⭐ Fidelizados**: Clientes com maior engajamento
- **💀 VIP**: Área exclusiva para clientes premium
- **⚙️ Configurações**: Personalize cores e efeitos

---

## 🎯 Funcionalidades Principais

### 1. Gestão de Clientes

- **Busca rápida**: Digite nome, email ou estilo de tatuagem
- **Filtros**: Por status (Agendado, Ativo, Fidelizado, Inativo)
- **Detalhes**: Clique em qualquer card para ver informações completas
- **Status visual**: Cada cliente tem cor e badge específico

### 2. Kanban Board

- **Arraste e solte**: Mova clientes entre as colunas
- **4 Status disponíveis**:
  - 🟦 Agendado (azul petróleo)
  - ⚪ Ativo (cinza claro)
  - ❤️ Fidelizado (vermelho neon)
  - ⬛ Inativo (cinza carvão)

### 3. Retornos

- **Lista cronológica**: Ordenada por data
- **Contador de dias**: Quantos dias faltam
- **Alertas visuais**: Urgentes em vermelho neon piscante
- **Informações completas**: Contato e observações

### 4. Clientes Fidelizados

- **Dashboard estatístico**: Números totais
- **Ranking**: Ordenado por quantidade de tatuagens
- **Badges especiais**: VIP e fidelizado destacados

### 5. Área VIP

- **Top 3 ranking**: Primeiros lugares destacados
- **Métricas exclusivas**: Estatísticas detalhadas
- **Design premium**: Efeitos neon intensificados

### 6. Configurações

- **Cor do neon**: Escolha entre várias cores
- **Intensidade**: Ajuste o brilho (0-200%)
- **Efeito piscar**: Ative/desative o blink realístico
- **Preview ao vivo**: Veja as mudanças em tempo real

---

## 🎨 Personalização

### Trocar Cor do Neon

1. Vá em **⚙️ Configurações**
2. Seção **"Cor do Neon"**
3. Clique no seletor de cor
4. Escolha sua cor favorita
5. Ou selecione um dos presets: Vermelho, Verde, Azul, Magenta, Ciano, Amarelo
6. Clique em **"APLICAR CONFIGURAÇÕES"**

### Ajustar Intensidade

1. Em **⚙️ Configurações**
2. Seção **"Intensidade do Brilho"**
3. Arraste o slider de 0% a 200%
4. Veja o preview em tempo real
5. Aplique quando satisfeito

---

## 🗃️ Dados Mock Inclusos

O sistema vem com **20 clientes fictícios** pré-cadastrados:

- Nomes artísticos autênticos
- Diversos estilos: Blackwork, Neo Traditional, Realismo, Oriental, etc.
- Histórico de visitas
- Agendamentos futuros
- Observações detalhadas
- Status variados
- 9 clientes VIP

**Exemplos**:
- Rafael 'Skull King' Santos - 12 tattoos (VIP)
- Luna 'Dark Rose' Silva - 5 tattoos
- Diego 'Mad Ink' Ferreira - 18 tattoos (VIP)

---

## 🏗️ Estrutura de Arquivos

```
CRM-Para-Studio/
│
├── public/
│   └── skull-icon.svg          # Ícone da caveira
│
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Cabeçalho das páginas
│   │   ├── Sidebar.jsx         # Menu lateral
│   │   └── SkullLogo.jsx       # Logo animado SVG
│   │
│   ├── data/
│   │   └── mockData.js         # 20 clientes mock
│   │
│   ├── pages/
│   │   ├── Clientes.jsx        # Lista de clientes
│   │   ├── Configuracoes.jsx   # Personalizações
│   │   ├── Fidelizados.jsx     # Dashboard fidelizados
│   │   ├── Kanban.jsx          # Board drag-and-drop
│   │   ├── Login.jsx           # Tela inicial
│   │   ├── Retornos.jsx        # Agendamentos
│   │   └── VIP.jsx             # Área premium
│   │
│   ├── App.jsx                 # Componente principal
│   ├── index.css               # Estilos globais + Tailwind
│   └── main.jsx                # Entry point
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js          # Config Tailwind + cores neon
└── vite.config.js
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```powershell
npm run dev
```
Inicia servidor local em http://localhost:3000

### Build de Produção
```powershell
npm run build
```
Gera pasta `dist/` com arquivos otimizados

### Preview da Build
```powershell
npm run preview
```
Visualiza a versão de produção localmente

---

## 🐛 Resolução de Problemas

### Erro: "npm não é reconhecido"
**Solução**: Instale o Node.js (https://nodejs.org/)

### Erro ao instalar dependências
**Solução**: 
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Porta 3000 já em uso
**Solução**: O Vite escolherá automaticamente outra porta (3001, 3002, etc.)

### Efeitos neon não aparecem
**Solução**: 
1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Recarregue com Ctrl + F5

---

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### Responsividade
- 📱 Mobile: 375px+
- 💻 Tablet: 768px+
- 🖥️ Desktop: 1024px+

---

## 🎓 Tecnologias Aprendidas

Ao estudar este projeto, você aprenderá:

- ⚛️ React Hooks (useState, useEffect)
- 🎨 Tailwind CSS avançado
- 🎯 Drag and Drop com react-beautiful-dnd
- 🎭 Animações CSS personalizadas
- 📦 Build com Vite
- 🗂️ Componentização React
- 🎨 Design system completo
- 🌈 Tematização e personalização

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Instale a CLI:
```powershell
npm i -g vercel
```

2. Execute:
```powershell
vercel
```

3. Siga as instruções interativas

### Netlify

1. Execute o build:
```powershell
npm run build
```

2. Arraste a pasta `dist/` para https://app.netlify.com/drop

---

## 🤝 Suporte

### Problemas Conhecidos
- Nenhum no momento

### Reportar Bug
Se encontrar algum problema:
1. Descreva o erro
2. Informe o navegador e versão
3. Inclua prints se possível

---

## 📈 Roadmap

**v1.0** (Atual)
- ✅ Sistema completo funcional
- ✅ 20 clientes mock
- ✅ Todas as páginas implementadas
- ✅ Efeitos neon completos

**v2.0** (Futuro)
- [ ] Backend com Node.js
- [ ] Banco de dados real
- [ ] Autenticação JWT
- [ ] API REST

**v3.0** (Futuro)
- [ ] Upload de fotos
- [ ] Sistema de pagamentos
- [ ] Relatórios PDF
- [ ] Notificações push

---

## 💡 Dicas de Uso

1. **Explore o Kanban**: É a funcionalidade mais interativa
2. **Personalize as cores**: Teste diferentes combinações de neon
3. **Veja os detalhes**: Clique nos cards de clientes para mais info
4. **Use os filtros**: Facilita encontrar clientes específicos
5. **Monitore retornos**: Fique de olho nos agendamentos urgentes

---

## 🎉 Pronto para Começar!

Agora é só executar:

```powershell
npm install
npm run dev
```

E aproveitar o **INKHOUSE CRM**! 💀🔥

---

<div align="center">

**Desenvolvido com ❤️ por Evelyn Moura**

*Automação & Processos*

</div>

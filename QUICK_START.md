# 🚀 Quick Start - INKHOUSE CRM

## ⚡ Instalação Rápida (3 passos)

### 1️⃣ Instale o Node.js
👉 https://nodejs.org/ (versão LTS)

### 2️⃣ Abra o PowerShell nesta pasta e execute:
```powershell
npm install
```

### 3️⃣ Inicie o sistema:
```powershell
npm run dev
```

✅ **Pronto!** O sistema abrirá em http://localhost:3000

---

## 🔑 Login

Digite **qualquer** usuário e senha (é uma demo)

---

## 🗺️ Navegação Rápida

### Menu Lateral (Sidebar):

📁 **Clientes** → Lista todos os 20 clientes mock
- Busque por nome, email ou estilo
- Filtre por status
- Clique em um card para ver detalhes

🗓️ **Retornos** → Próximos agendamentos
- Veja quantos dias faltam
- Alertas em vermelho para urgentes

🧩 **Kanban** → Board visual drag-and-drop
- Arraste clientes entre as 4 colunas
- Status: Agendado → Ativo → Fidelizado → Inativo

⭐ **Fidelizados** → Dashboard de clientes fiéis
- Estatísticas gerais
- Lista ordenada por total de tattoos

💀 **VIP** → Área premium
- Top 3 ranking destacado
- Métricas exclusivas
- 9 clientes VIP inclusos

⚙️ **Configurações** → Personalize o visual
- Mude a cor do neon (vermelho, verde, azul, etc)
- Ajuste a intensidade do brilho
- Ative/desative o efeito piscar

---

## 🎨 Personalize Agora

1. Vá em **⚙️ Configurações**
2. Clique no **seletor de cor**
3. Escolha sua cor favorita
4. Ajuste o **slider de intensidade**
5. Clique em **APLICAR CONFIGURAÇÕES**

🎉 Veja o sistema com seu estilo!

---

## 📊 Dados Inclusos

✅ **20 clientes fictícios** com:
- Nomes artísticos de tatuadores
- Estilos variados (Blackwork, Realismo, Neo Traditional, etc)
- Histórico completo de visitas
- Agendamentos futuros
- Status variados
- 9 clientes marcados como VIP

---

## 🔥 Funcionalidades Principais

### No Kanban:
- **Arraste** os cards de clientes
- **Solte** em outra coluna
- Veja a atualização instantânea

### Em Clientes:
- **Digite** na busca para filtrar
- **Clique** nos botões de status
- **Clique** em um card para detalhes

### Em Retornos:
- **Vermelho neon** = agendamento urgente (≤3 dias)
- **Vermelho normal** = próximo (4-7 dias)
- **Cinza** = distante ou passou

---

## 🎯 Para Testar Tudo

1. ✅ Login (qualquer user/pass)
2. ✅ Navegue por todas as páginas
3. ✅ Busque um cliente por nome
4. ✅ Arraste cards no Kanban
5. ✅ Veja os detalhes de um cliente
6. ✅ Mude a cor do neon em Configurações
7. ✅ Ajuste a intensidade do brilho

---

## 📁 Arquivos Importantes

```
src/
├── App.jsx              → Navegação principal
├── pages/
│   ├── Login.jsx        → Tela inicial
│   ├── Clientes.jsx     → Lista de clientes
│   ├── Kanban.jsx       → Board drag-and-drop
│   └── ...              → Outras páginas
└── data/
    └── mockData.js      → 20 clientes (EDITE AQUI!)
```

### 💡 Dica: Adicione mais clientes!

Edite `src/data/mockData.js` e adicione novos objetos ao array `mockClients`:

```javascript
{
  id: 21,
  name: "Seu Nome 'Apelido' Aqui",
  email: "email@example.com",
  phone: "(11) 99999-9999",
  style: "Blackwork",
  status: "ativo",
  lastVisit: "2025-11-20",
  nextAppointment: "2025-12-01",
  observations: "Suas observações aqui",
  vip: false,
  totalTattoos: 5
}
```

---

## 🆘 Problemas?

### "npm não é reconhecido"
→ Instale o Node.js: https://nodejs.org/

### Porta 3000 ocupada
→ O Vite usará automaticamente 3001, 3002, etc

### Efeitos neon não aparecem
→ Limpe o cache: `Ctrl + Shift + Delete`
→ Recarregue: `Ctrl + F5`

---

## 📚 Documentação Completa

Veja os outros arquivos:
- **README.md** → Documentação completa
- **INSTALACAO.md** → Guia detalhado passo a passo
- **ESTRUTURA.md** → Arquitetura do projeto
- **RESUMO_PROJETO.md** → Tudo que foi criado

---

## 🎓 Próximos Passos

### Fácil:
1. Adicione mais clientes no mockData.js
2. Mude as cores do sistema
3. Experimente diferentes intensidades de neon

### Médio:
1. Crie novos filtros
2. Adicione novos campos aos clientes
3. Personalize os textos

### Avançado:
1. Conecte um backend real
2. Adicione banco de dados
3. Implemente autenticação
4. Faça deploy em produção

---

<div align="center">

## 💀 INKHOUSE CRM

**"Tatuagens contam histórias. O CRM guarda todas elas."**

---

### 🏃 Execute agora:
```
npm install && npm run dev
```

---

Desenvolvido por **Evelyn Moura** • Automação & Processos

</div>

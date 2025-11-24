# 🏴‍☠️ INKHOUSE CRM — Tattoo Studio Manager

<div align="center">

![INKHOUSE CRM](https://img.shields.io/badge/INKHOUSE-CRM-FF0000?style=for-the-badge&logo=skull&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**"Tatuagens contam histórias. O CRM guarda todas elas."**

</div>

---

## 📋 Sobre o Projeto

O **INKHOUSE CRM** é um sistema completo de gerenciamento para estúdios de tatuagem, desenvolvido com foco em estética dark premium e funcionalidades específicas para o mercado de tattoo. 

O sistema oferece controle total sobre clientes, agendamentos, status de fidelização e muito mais, tudo em uma interface visualmente impactante com tema neon vermelho sobre fundo escuro.

---

## 🎨 Identidade Visual

### Paleta de Cores

| Elemento | Cor | HEX |
|----------|-----|-----|
| **Fundo** | Preto profundo | `#0C0C0D` |
| **Destaque principal** | Vermelho neon | `#FF0000` |
| **Secundária** | Azul petróleo | `#0A3D62` |
| **Tipografia** | Cinza gelo | `#E6E6E6` |
| **Bordas e UI** | Cinza carvão | `#343434` |

### Tipografia

- **Títulos**: Poppins Bold
- **Textos e UI**: Inter / Montserrat
- **Estilo especial**: Neon style outline para títulos estilizados

### Logo & Estética

O sistema utiliza como referência visual a estética de caveira neon vermelha:

- 💀 Ícone de caveira outline minimal
- ✨ Contorno vermelho neon com efeito glow
- ⚡ Traços contínuos com estética iluminada
- 🎯 Contraste forte sobre fundo preto
- 🔥 Efeito de placa neon realístico

---

## 🚀 Funcionalidades

### 📁 Gestão de Clientes

- Listagem completa com busca e filtros
- Cards informativos com dados de contato
- Visualização detalhada de histórico
- Status visual (Agendado, Ativo, Fidelizado, Inativo)
- Badges VIP para clientes premium

### 🗓️ Retornos Agendados

- Lista de próximos agendamentos
- Contador de dias até o retorno
- Alertas visuais para agendamentos urgentes
- Histórico de visitas do cliente

### 🧩 Kanban Board

- Sistema drag-and-drop intuitivo
- 4 colunas de status com cores distintas:
  - 🟦 **Agendado** (Azul petróleo)
  - ⚪ **Ativo** (Cinza claro)
  - ❤️ **Fidelizado** (Vermelho neon com glow)
  - ⬛ **Inativo** (Cinza carvão)
- Movimentação visual de clientes entre status

### ⭐ Clientes Fidelizados

- Dashboard com estatísticas
- Lista dos clientes mais fiéis
- Métricas de engajamento
- Histórico completo de tatuagens

### 💀 Área VIP

- Ranking de clientes premium
- Estatísticas exclusivas
- Design diferenciado com efeitos especiais
- Métricas de performance

### ⚙️ Configurações

- Personalização da cor do neon
- Ajuste de intensidade do brilho
- Ativação/desativação do efeito piscar
- Informações do sistema

---

## 🛠️ Tecnologias Utilizadas

- **React 18.2** - Biblioteca JavaScript para interface
- **Vite 5.0** - Build tool e dev server
- **Tailwind CSS 3.3** - Framework CSS utility-first
- **react-beautiful-dnd** - Biblioteca para drag and drop
- **Lucide React** - Biblioteca de ícones
- **JavaScript ES6+** - Linguagem de programação

---

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/evemoura56-cloud/CRM-Para-Studio.git
cd CRM-Para-Studio
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

---

## 📊 Estrutura do Projeto

```
CRM-Para-Studio/
├── public/
│   └── skull-icon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── SkullLogo.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── Clientes.jsx
│   │   ├── Configuracoes.jsx
│   │   ├── Fidelizados.jsx
│   │   ├── Kanban.jsx
│   │   ├── Login.jsx
│   │   ├── Retornos.jsx
│   │   └── VIP.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎯 Banco de Dados Mock

O sistema inclui 20 clientes fictícios com:

- Nomes artísticos autênticos do universo tattoo
- Diversos estilos de tatuagem (Blackwork, Neo Traditional, Realismo, etc.)
- Histórico de visitas e agendamentos
- Observações detalhadas sobre preferências
- Status de fidelização variados
- Classificação VIP

---

## 🔥 Efeitos Especiais Implementados

### Efeitos CSS Neon

- **Glow effect**: Brilho vermelho neon em elementos principais
- **Hover transitions**: Transições suaves com intensificação do brilho
- **Shadow effects**: Sombras personalizadas com blur
- **Text shadows**: Múltiplas camadas de sombra para texto neon

### Animações

- **Pulse neon**: Pulsação contínua do logo
- **Blink effect**: Efeito de piscar realístico de placa neon
- **Hover scale**: Ampliação suave ao passar o mouse
- **Drag feedback**: Feedback visual ao arrastar cards no Kanban

### Customizações

- Logo gerenciável via CSS (SVG inline)
- Possibilidade de variação da cor do neon
- Modo "blink neon realístico" ativável
- Intensidade ajustável do efeito glow

---

## 🎨 Referências de Design

O design foi inspirado em:

- 🪧 Placas de neon vintage de estúdios de tatuagem
- 💀 Arte mexicana (Día de Los Muertos)
- 🌃 Estética urbana noturna
- 🎸 Cultura rock/punk alternativa
- ⚡ Interfaces dark mode premium

---

## 👤 Desenvolvido Por

**Evelyn Moura**  
*Automação & Processos*

---

## 📝 Licença

Este projeto é de código aberto e está disponível para uso e modificação.

---

## 🌟 Objetivo do Sistema

O INKHOUSE CRM foi desenvolvido para refletir:

- ✅ Estética dark premium
- ✅ Vibe tatuador profissional
- ✅ Algo que um tattoo studio REAL gostaria de usar
- ✅ Sensação de placa neon vermelha iluminando o sistema
- ✅ Energia urbana, noturna e artística

---

## 📸 Screenshots

### Tela de Login
- Logo caveira neon centralizado
- Slogan do sistema
- Formulário minimalista com efeitos neon

### Dashboard Principal
- Sidebar com menu navegável
- Header com título em neon
- Conteúdo dinâmico por página

### Kanban Board
- 4 colunas coloridas
- Drag and drop funcional
- Cards informativos de clientes

### Área VIP
- Ranking de clientes premium
- Estatísticas destacadas
- Design exclusivo com glow intenso

---

## 🔄 Próximas Atualizações

- [ ] Integração com banco de dados real
- [ ] Sistema de autenticação completo
- [ ] Exportação de relatórios em PDF
- [ ] Notificações push para agendamentos
- [ ] Galeria de fotos de trabalhos
- [ ] Sistema de pagamentos
- [ ] Dashboard analítico avançado
- [ ] App mobile

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

## 📧 Contato

Para dúvidas, sugestões ou parcerias:

- GitHub: [@evemoura56-cloud](https://github.com/evemoura56-cloud)
- Email: [contato disponível no perfil]

---

<div align="center">

**🏴‍☠️ INKHOUSE CRM**

*Tatuagens contam histórias. O CRM guarda todas elas.*

---

Desenvolvido com ❤️ e muito ☕ por **Evelyn Moura**

</div>

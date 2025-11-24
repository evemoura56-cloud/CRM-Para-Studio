import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const seedPassword = 'inkhouse123';
const defaultHash = bcrypt.hashSync(seedPassword, 10);

const baseStudios = [
  {
    name: 'Skull King Ink',
    slug_subdominio: 'skullking',
    email_contato: 'contato@skullking.ink',
    telefone: '+55 11 90000-0001',
    endereco: 'Av. do Rock, 666 - SP',
    plano_atual: 'premium'
  },
  {
    name: 'Black Rose Atelier',
    slug_subdominio: 'blackrose',
    email_contato: 'contato@blackrose.ink',
    telefone: '+55 21 90000-0002',
    endereco: 'Rua das Rosas, 13 - RJ',
    plano_atual: 'pro'
  },
  {
    name: 'Night Owl Tattoo',
    slug_subdominio: 'nightowl',
    email_contato: 'hello@nightowl.ink',
    telefone: '+55 31 90000-0003',
    endereco: 'Alameda Noturna, 77 - BH',
    plano_atual: 'pro'
  },
  {
    name: 'Crimson Lab',
    slug_subdominio: 'crimsonlab',
    email_contato: 'oi@crimsonlab.ink',
    telefone: '+55 41 90000-0004',
    endereco: 'Rua Vermelha, 404 - Curitiba',
    plano_atual: 'free'
  },
  {
    name: 'Void Walker Studio',
    slug_subdominio: 'voidwalker',
    email_contato: 'dark@voidwalker.ink',
    telefone: '+55 61 90000-0005',
    endereco: 'Setor Subsolo, 101 - DF',
    plano_atual: 'premium'
  }
];

const baseClients = [
  ["Rafael 'Skull King' Santos", 'Blackwork', 'fidelizado'],
  ["Luna 'Dark Rose' Silva", 'Neo Traditional', 'ativo'],
  ["Diego 'Mad Ink' Ferreira", 'Old School', 'agendado'],
  ["Amanda 'Serpent Queen' Costa", 'Realismo', 'fidelizado'],
  ["Carlos 'Iron Hand' Oliveira", 'Tribal', 'ativo'],
  ["Bianca 'Red Witch' Alves", 'Aquarela', 'fidelizado'],
  ["Pedro 'Black Venom' Souza", 'Blackwork', 'inativo'],
  ["Julia 'Phoenix Fire' Lima", 'Oriental', 'agendado'],
  ["Rodrigo 'Steel Wolf' Martins", 'Geométrico', 'ativo'],
  ["Mariana 'Night Owl' Ribeiro", 'Fine Line', 'fidelizado'],
  ["Thiago 'Raven Dark' Pereira", 'Trash Polka', 'ativo'],
  ["Camila 'Sugar Death' Rocha", 'Mexicano', 'fidelizado'],
  ["Felipe 'Thunder Bolt' Gomes", 'New School', 'agendado'],
  ["Isabela 'Moon Shadow' Nunes", 'Dotwork', 'inativo'],
  ["Gabriel 'Void Walker' Castro", 'Surrealismo', 'agendado'],
  ["Patrícia 'Wild Cat' Morais", 'Realismo', 'ativo'],
  ["Bruno 'Ink Warrior' Teixeira", 'Japonês Tradicional', 'fidelizado'],
  ["Vanessa 'Black Widow' Campos", 'Blackwork', 'ativo'],
  ["Sofia 'Iron Lotus' Martins", 'Oriental', 'agendado'],
  ["Victor 'Ink Ronin' Tanaka", 'Japonês Tradicional', 'fidelizado']
];

const baseObservations = [
  'Prefere sessões longas e projetos fechados.',
  'Fã de referências orientais, gosta de linhas finas.',
  'Busca efeitos vibrantes e contraste alto.',
  'Coleciona tattoos pequenas com significado pessoal.',
  'Valoriza simetria e padrões geométricos.',
  'Quer fechar manga com tema dark.',
  'Cliente VIP fiel, sempre indica amigos.',
  'Retorno marcado para retoque de cor.',
  'Busca artes exclusivas e autorais.',
  'Ama estética neon e cyberpunk.'
];

const makePhone = (index) => `+55 11 98${(index + 1000).toString().slice(1)}-${(3000 + index).toString().padStart(4, '0')}`;

export function buildSeedData() {
  const now = new Date();
  const studios = baseStudios.map((studio, idx) => ({
    id: `studio-${idx + 1}`,
    ...studio,
    data_inicio_plano: now.toISOString(),
    data_fim_plano: null,
    ativo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  }));

  const users = [];
  const clients = [];
  const sessions = [];
  const subscriptions = [];
  const activity_logs = [];
  const settings = [];

  studios.forEach((studio) => {
    const ownerId = uuid();
    const artistId = uuid();
    const assistantId = uuid();

    users.push(
      {
        id: ownerId,
        studio_id: studio.id,
        nome: `${studio.name} Owner`,
        email: `owner@${studio.slug_subdominio}.ink`,
        senha_hash: defaultHash,
        role: 'owner',
        ativo: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: artistId,
        studio_id: studio.id,
        nome: `${studio.name} Artist`,
        email: `artist@${studio.slug_subdominio}.ink`,
        senha_hash: defaultHash,
        role: 'artist',
        ativo: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: assistantId,
        studio_id: studio.id,
        nome: `${studio.name} Assistant`,
        email: `assistant@${studio.slug_subdominio}.ink`,
        senha_hash: defaultHash,
        role: 'assistant',
        ativo: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    );

    subscriptions.push({
      id: uuid(),
      studio_id: studio.id,
      plano: studio.plano_atual,
      status: studio.plano_atual === 'free' ? 'trial' : 'ativo',
      metodo_pagamento: 'pix_simulado',
      valor_mensal: studio.plano_atual === 'premium' ? 299 : studio.plano_atual === 'pro' ? 169 : 0,
      data_inicio: now.toISOString(),
      data_fim: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    });

    settings.push({
      id: uuid(),
      studio_id: studio.id,
      cor_neon: '#FF0000',
      brilho_neon: 80,
      efeito_piscar_neon: true,
      lembretes_whatsapp_ativos: studio.plano_atual !== 'free',
      dias_antecedencia_lembrete: 3,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    });

    const studioClients = [];
    for (let i = 0; i < 15; i++) {
      const [name, style, status] = baseClients[i % baseClients.length];
      const clientId = `${studio.id}-client-${i + 1}`;
      const lastVisit = new Date(now);
      lastVisit.setDate(lastVisit.getDate() - (5 + i));
      const nextAppointment = new Date(now);
      nextAppointment.setDate(nextAppointment.getDate() + (i % 12));

      const totalTattoos = 2 + (i % 9);
      const clientStatus = status === 'inativo' && i % 3 === 0 ? 'inativo' : status;
      studioClients.push({
        id: clientId,
        studio_id: studio.id,
        nome: `${name} - ${studio.slug_subdominio}`,
        telefone: makePhone(i),
        instagram: `@${studio.slug_subdominio}_${i + 1}`,
        email: `${studio.slug_subdominio}${i + 1}@ink.com`,
        estilo_favorito: style,
        servico_principal: 'Tattoo custom',
        ultimo_atendimento: lastVisit.toISOString().substring(0, 10),
        proximo_retorno: clientStatus === 'inativo' ? null : nextAppointment.toISOString().substring(0, 10),
        status: clientStatus,
        total_tatuagens: totalTattoos,
        observacoes: baseObservations[i % baseObservations.length],
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      });
    }

    clients.push(...studioClients);

    studioClients.slice(0, 10).forEach((client, idx) => {
      const sessionDate = new Date(now);
      sessionDate.setDate(sessionDate.getDate() - idx * 7);
      sessions.push({
        id: `${client.id}-session-${idx + 1}`,
        studio_id: studio.id,
        client_id: client.id,
        artist_id: artistId,
        data_sessao: sessionDate.toISOString().substring(0, 10),
        tipo_sessao: idx % 3 === 0 ? 'primeira' : 'continuidade',
        duracao_horas: 3 + (idx % 2),
        valor_cobrado: 800 + idx * 50,
        status: idx % 4 === 0 ? 'agendada' : 'realizada',
        descricao_trabalho: `Tattoo temática para ${client.nome}`,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      });
    });

    activity_logs.push({
      id: uuid(),
      studio_id: studio.id,
      user_id: ownerId,
      tipo_acao: 'register_studio',
      detalhes: JSON.stringify({ studio: studio.slug_subdominio }),
      created_at: now.toISOString()
    });
  });

  users.push({
    id: uuid(),
    studio_id: null,
    nome: 'Admin Master',
    email: 'admin@inkhouse.cloud',
    senha_hash: defaultHash,
    role: 'admin_master',
    ativo: true,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  });

  return {
    seed_password: seedPassword,
    studios,
    users,
    clients,
    sessions,
    subscriptions,
    activity_logs,
    settings
  };
}

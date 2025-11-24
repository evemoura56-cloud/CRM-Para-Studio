import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { buildSeedData } from './data/seed.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'inkhouse-neon-secret';
const PORT = process.env.PORT || 4000;

const db = buildSeedData();

const planLimits = {
  free: { maxClients: 15, mobile: false, exportCSV: false, exportPDF: false, logs: false },
  pro: { maxClients: null, mobile: true, exportCSV: true, exportPDF: false, logs: true },
  premium: { maxClients: null, mobile: true, exportCSV: true, exportPDF: true, logs: true }
};

const getSubscription = (studioId) =>
  db.subscriptions.find((sub) => sub.studio_id === studioId && sub.status !== 'cancelado');

const getPlan = (studioId) => getSubscription(studioId)?.plano || 'free';

const signToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      studioId: user.studio_id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token ausente' });
  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const requireTenant = (req, res, next) => {
  if (!req.user?.studioId) {
    return res.status(403).json({ error: 'Usuário não está associado a um estúdio' });
  }
  next();
};

const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Permissão negada' });
  }
  next();
};

const requirePlan = (allowedPlans, featureName) => (req, res, next) => {
  if (!req.user?.studioId) return next();
  const plan = getPlan(req.user.studioId);
  if (!allowedPlans.includes(plan)) {
    return res
      .status(403)
      .json({ error: `Recurso ${featureName || ''} disponível apenas para: ${allowedPlans.join(', ')}` });
  }
  next();
};

const enforceClientStatus = (clientId) => {
  const client = db.clients.find((c) => c.id === clientId);
  if (!client) return;

  const clientSessions = db.sessions.filter(
    (s) => s.client_id === clientId && s.status === 'realizada'
  );

  if (clientSessions.length >= 4) {
    client.status = 'fidelizado';
  }

  const lastSession = clientSessions.sort(
    (a, b) => new Date(b.data_sessao) - new Date(a.data_sessao)
  )[0];

  if (lastSession) {
    const daysDiff = (Date.now() - new Date(lastSession.data_sessao).getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 180) {
      client.status = 'inativo';
    }
  }
};

app.get('/health', (_req, res) => res.json({ status: 'ok', version: '0.1.0' }));

app.post('/auth/register-studio', (req, res) => {
  const {
    nome_estudio,
    slug_subdominio,
    email_contato,
    telefone,
    endereco,
    owner_nome,
    owner_email,
    owner_senha
  } = req.body;

  if (!nome_estudio || !slug_subdominio || !owner_email || !owner_senha) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  const slugExists = db.studios.some((studio) => studio.slug_subdominio === slug_subdominio);
  if (slugExists) return res.status(409).json({ error: 'Slug já utilizado' });

  const studioId = uuid();
  const now = new Date().toISOString();

  const newStudio = {
    id: studioId,
    nome_estudio,
    slug_subdominio,
    email_contato,
    telefone,
    endereco,
    plano_atual: 'free',
    data_inicio_plano: now,
    data_fim_plano: null,
    ativo: true,
    created_at: now,
    updated_at: now
  };

  const ownerId = uuid();
  const newOwner = {
    id: ownerId,
    studio_id: studioId,
    nome: owner_nome || 'Owner',
    email: owner_email,
    senha_hash: bcrypt.hashSync(owner_senha, 10),
    role: 'owner',
    ativo: true,
    created_at: now,
    updated_at: now
  };

  const subscription = {
    id: uuid(),
    studio_id: studioId,
    plano: 'free',
    status: 'trial',
    metodo_pagamento: 'pix_simulado',
    valor_mensal: 0,
    data_inicio: now,
    data_fim: null,
    created_at: now,
    updated_at: now
  };

  db.studios.push(newStudio);
  db.users.push(newOwner);
  db.subscriptions.push(subscription);

  const token = signToken(newOwner);

  return res.status(201).json({
    studio: newStudio,
    user: { id: newOwner.id, email: newOwner.email, role: newOwner.role, studio_id: studioId },
    subscription,
    token,
    trial_days: 7
  });
});

app.post('/auth/login', (req, res) => {
  const { email, senha, studio_slug } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const studio = user.studio_id
    ? db.studios.find((s) => s.id === user.studio_id)
    : null;

  if (studio_slug && studio && studio.slug_subdominio !== studio_slug) {
    return res.status(401).json({ error: 'Estúdio inválido para este usuário' });
  }

  const passwordOk = bcrypt.compareSync(senha, user.senha_hash);
  if (!passwordOk) return res.status(401).json({ error: 'Senha inválida' });

  const token = signToken(user);
  const subscription = studio ? getSubscription(studio.id) : null;

  return res.json({
    token,
    user: {
      id: user.id,
      role: user.role,
      studio_id: user.studio_id,
      email: user.email
    },
    studio,
    subscription,
    seed_password_hint: 'Use a senha padrão inkhouse123 nos usuários de teste.'
  });
});

app.get('/clients', authenticate, requireTenant, (req, res) => {
  const { status, search } = req.query;
  const studioClients = db.clients.filter((c) => c.studio_id === req.user.studioId);

  let filtered = studioClients;
  if (status) filtered = filtered.filter((c) => c.status === status);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.nome.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.estilo_favorito.toLowerCase().includes(s)
    );
  }
  return res.json({ clients: filtered });
});

app.post('/clients', authenticate, requireTenant, (req, res) => {
  const plan = getPlan(req.user.studioId);
  const limit = planLimits[plan]?.maxClients;
  const currentTotal = db.clients.filter((c) => c.studio_id === req.user.studioId).length;
  if (limit && currentTotal >= limit) {
    return res.status(403).json({ error: 'Limite de clientes do plano Free atingido. Faça upgrade.' });
  }

  const now = new Date().toISOString();
  const id = uuid();
  const newClient = {
    id,
    studio_id: req.user.studioId,
    nome: req.body.nome,
    telefone: req.body.telefone,
    instagram: req.body.instagram,
    email: req.body.email,
    estilo_favorito: req.body.estilo_favorito,
    servico_principal: req.body.servico_principal,
    ultimo_atendimento: null,
    proximo_retorno: req.body.proximo_retorno || null,
    status: req.body.status || 'agendado',
    total_tatuagens: 0,
    observacoes: req.body.observacoes || '',
    created_at: now,
    updated_at: now
  };
  db.clients.push(newClient);
  return res.status(201).json({ client: newClient });
});

app.put('/clients/:id', authenticate, requireTenant, (req, res) => {
  const client = db.clients.find(
    (c) => c.id === req.params.id && c.studio_id === req.user.studioId
  );
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

  Object.assign(client, { ...req.body, updated_at: new Date().toISOString() });
  enforceClientStatus(client.id);
  return res.json({ client });
});

app.get('/sessions', authenticate, requireTenant, (req, res) => {
  const studioSessions = db.sessions.filter((s) => s.studio_id === req.user.studioId);
  return res.json({ sessions: studioSessions });
});

app.post('/sessions', authenticate, requireTenant, (req, res) => {
  const { client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho } =
    req.body;
  const client = db.clients.find((c) => c.id === client_id && c.studio_id === req.user.studioId);
  if (!client) return res.status(404).json({ error: 'Cliente inválido' });

  const session = {
    id: uuid(),
    studio_id: req.user.studioId,
    client_id,
    artist_id: artist_id || req.user.userId,
    data_sessao,
    tipo_sessao,
    duracao_horas,
    valor_cobrado,
    status: status || 'realizada',
    descricao_trabalho,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.sessions.push(session);

  if (session.status === 'realizada') {
    client.ultimo_atendimento = data_sessao;
    client.total_tatuagens = (client.total_tatuagens || 0) + 1;
  } else if (session.status === 'agendada') {
    client.proximo_retorno = data_sessao;
  }

  enforceClientStatus(client.id);
  return res.status(201).json({ session, client });
});

app.get('/dashboard', authenticate, requireTenant, (req, res) => {
  const studioClients = db.clients.filter((c) => c.studio_id === req.user.studioId);
  const studioSessions = db.sessions.filter((s) => s.studio_id === req.user.studioId);

  const fidelizados = studioClients.filter((c) => c.status === 'fidelizado').length;
  const agendados = studioClients.filter((c) => c.status === 'agendado').length;
  const totalReceita = studioSessions
    .filter((s) => s.status === 'realizada')
    .reduce((acc, s) => acc + Number(s.valor_cobrado || 0), 0);

  const mediaTattoos =
    studioClients.reduce((acc, c) => acc + (c.total_tatuagens || 0), 0) /
    (studioClients.length || 1);

  return res.json({
    totalClientes: studioClients.length,
    fidelizados,
    agendados,
    mediaTattoos: Number(mediaTattoos.toFixed(2)),
    receitaTotal: totalReceita
  });
});

app.get('/settings', authenticate, requireTenant, (req, res) => {
  const settings = db.settings.find((s) => s.studio_id === req.user.studioId);
  return res.json({ settings });
});

app.put('/settings', authenticate, requireTenant, (req, res) => {
  const settings = db.settings.find((s) => s.studio_id === req.user.studioId);
  if (!settings) return res.status(404).json({ error: 'Configurações não encontradas' });

  Object.assign(settings, { ...req.body, updated_at: new Date().toISOString() });
  return res.json({ settings });
});

app.get('/subscriptions', authenticate, requireTenant, (req, res) => {
  const subscription = getSubscription(req.user.studioId);
  return res.json({ subscription });
});

app.post('/subscriptions/upgrade', authenticate, requireTenant, (req, res) => {
  const { plano, metodo_pagamento } = req.body;
  if (!['free', 'pro', 'premium'].includes(plano)) {
    return res.status(400).json({ error: 'Plano inválido' });
  }
  const subscription = getSubscription(req.user.studioId);
  if (!subscription) return res.status(404).json({ error: 'Assinatura não encontrada' });

  subscription.plano = plano;
  subscription.metodo_pagamento = metodo_pagamento || 'pix_simulado';
  subscription.status = plano === 'free' ? 'trial' : 'ativo';
  subscription.updated_at = new Date().toISOString();

  return res.json({ subscription });
});

app.post('/subscriptions/callback', (req, res) => {
  const { studio_slug, status } = req.body;
  const studio = db.studios.find((s) => s.slug_subdominio === studio_slug);
  if (!studio) return res.status(404).json({ error: 'Estúdio não encontrado' });

  const subscription = getSubscription(studio.id);
  if (!subscription) return res.status(404).json({ error: 'Assinatura não encontrada' });

  subscription.status = status || 'ativo';
  subscription.updated_at = new Date().toISOString();
  return res.json({ ok: true, subscription });
});

app.get('/admin/studios', authenticate, requireRole(['admin_master']), (_req, res) => {
  const payload = db.studios.map((studio) => ({
    ...studio,
    assinaturas: db.subscriptions.filter((s) => s.studio_id === studio.id),
    usuarios: db.users.filter((u) => u.studio_id === studio.id).length,
    clientes: db.clients.filter((c) => c.studio_id === studio.id).length
  }));
  res.json({ studios: payload });
});

app.get('/admin/activity-logs', authenticate, requireRole(['admin_master']), (_req, res) => {
  res.json({ activity_logs: db.activity_logs });
});

app.listen(PORT, () => {
  console.log(`INKHOUSE API rodando na porta ${PORT}`);
});

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import config from '../config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const [users] = await db.query(
      `SELECT u.*, s.nome_estudio, s.plano_atual, s.ativo as studio_ativo 
       FROM users u 
       LEFT JOIN studios s ON u.studio_id = s.id 
       WHERE u.email = ?`,
      [email]
    );
    
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const user = users[0];
    
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    if (!user.ativo) {
      return res.status(403).json({ error: 'Usuário inativo. Entre em contato com o administrador.' });
    }
    
    if (user.role !== 'admin_master' && !user.studio_ativo) {
      return res.status(403).json({ error: 'Estúdio inativo. Entre em contato com o suporte.' });
    }
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [user.studio_id, user.id, 'login', JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] })]
    );
    
    const token = jwt.sign(
      { userId: user.id, studioId: user.studio_id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        studioId: user.studio_id,
        nomeEstudio: user.nome_estudio,
        planoAtual: user.plano_atual
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

router.post('/register-studio', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      nomeEstudio,
      slugSubdominio,
      emailContato,
      telefone,
      endereco,
      estiloPredominante,
      nomeProprietario,
      emailProprietario,
      senhaProprietario
    } = req.body;
    
    if (!nomeEstudio || !emailContato || !nomeProprietario || !emailProprietario || !senhaProprietario) {
      await connection.rollback();
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    
    const slug = slugSubdominio || nomeEstudio.toLowerCase().replace(/\s+/g, '').substring(0, 20);
    
    const [existingStudio] = await connection.query(
      'SELECT id FROM studios WHERE slug_subdominio = ?',
      [slug]
    );
    
    if (existingStudio.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Subdomínio já está em uso' });
    }
    
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [emailProprietario]
    );
    
    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + 7);
    
    const [studioResult] = await connection.query(
      `INSERT INTO studios (nome_estudio, slug_subdominio, email_contato, telefone, endereco, plano_atual, data_inicio_plano, data_fim_plano, ativo) 
       VALUES (?, ?, ?, ?, ?, 'free', ?, ?, true)`,
      [nomeEstudio, slug, emailContato, telefone || '', endereco || '', dataInicio, dataFim]
    );
    
    const studioId = studioResult.insertId;
    
    const senhaHash = await bcrypt.hash(senhaProprietario, 10);
    
    const [userResult] = await connection.query(
      `INSERT INTO users (studio_id, nome, email, senha_hash, role, ativo) 
       VALUES (?, ?, ?, ?, 'owner', true)`,
      [studioId, nomeProprietario, emailProprietario, senhaHash]
    );
    
    const userId = userResult.insertId;
    
    await connection.query(
      `INSERT INTO subscriptions (studio_id, plano, status, metodo_pagamento, valor_mensal, data_inicio, data_fim) 
       VALUES (?, 'free', 'trial', 'none', 0, ?, ?)`,
      [studioId, dataInicio, dataFim]
    );
    
    await connection.query(
      `INSERT INTO settings (studio_id, cor_neon, brilho_neon, efeito_piscar_neon, lembretes_whatsapp_ativos, dias_antecedencia_lembrete) 
       VALUES (?, '#FF0000', 80, false, true, 3)`,
      [studioId]
    );
    
    await connection.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [studioId, userId, 'create_studio', JSON.stringify({ estiloPredominante })]
    );
    
    await connection.commit();
    
    const token = jwt.sign(
      { userId: userId, studioId: studioId, role: 'owner' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.status(201).json({
      message: 'Estúdio criado com sucesso! Trial de 7 dias ativado.',
      token,
      studio: {
        id: studioId,
        nome: nomeEstudio,
        slug: slug,
        plano: 'free',
        trialEndsAt: dataFim
      },
      user: {
        id: userId,
        nome: nomeProprietario,
        email: emailProprietario,
        role: 'owner'
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao registrar estúdio:', error);
    res.status(500).json({ error: 'Erro ao criar estúdio' });
  } finally {
    connection.release();
  }
});

router.post('/validate-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      const [users] = await db.query(
        `SELECT u.*, s.nome_estudio, s.plano_atual 
         FROM users u 
         LEFT JOIN studios s ON u.studio_id = s.id 
         WHERE u.id = ? AND u.ativo = true`,
        [decoded.userId]
      );
      
      if (!users || users.length === 0) {
        return res.status(401).json({ valid: false, error: 'Usuário não encontrado' });
      }
      
      const user = users[0];
      
      res.json({
        valid: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          studioId: user.studio_id,
          nomeEstudio: user.nome_estudio,
          planoAtual: user.plano_atual
        }
      });
    } catch (jwtError) {
      return res.status(401).json({ valid: false, error: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(500).json({ error: 'Erro ao validar token' });
  }
});

export default router;

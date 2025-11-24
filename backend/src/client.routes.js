import express from 'express';
import { authMiddleware, multiTenantMiddleware } from '../middlewares.js';
import db from '../database.js';
import config from '../config.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM clients WHERE studio_id = ?';
    const params = [req.studioId];
    
    if (status && status !== 'Todos') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (nome LIKE ? OR email LIKE ? OR instagram LIKE ? OR estilo_favorito LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [clients] = await db.query(query, params);
    
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ?',
      [req.studioId]
    );
    
    res.json({
      clients,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [clients] = await db.query(
      'SELECT * FROM clients WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!clients || clients.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    const [sessions] = await db.query(
      `SELECT s.*, u.nome as artist_nome 
       FROM sessions s 
       LEFT JOIN users u ON s.artist_id = u.id 
       WHERE s.client_id = ? AND s.studio_id = ? 
       ORDER BY s.data_sessao DESC`,
      [req.params.id, req.studioId]
    );
    
    res.json({
      client: clients[0],
      sessions
    });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

router.post('/', async (req, res) => {
  try {
    const planConfig = config.plans[req.studioPlan];
    
    if (planConfig.maxClients !== -1) {
      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM clients WHERE studio_id = ?',
        [req.studioId]
      );
      
      if (countResult[0].total >= planConfig.maxClients) {
        return res.status(403).json({ 
          error: `Limite de ${planConfig.maxClients} clientes atingido no plano ${req.studioPlan}. Faça upgrade para adicionar mais clientes.`,
          upgradeRequired: true 
        });
      }
    }
    
    const {
      nome,
      telefone,
      instagram,
      email,
      estilo_favorito,
      servico_principal,
      proximo_retorno,
      status,
      observacoes
    } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    const [result] = await db.query(
      `INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, proximo_retorno, status, total_tatuagens, observacoes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        req.studioId,
        nome,
        telefone || '',
        instagram || '',
        email || '',
        estilo_favorito || '',
        servico_principal || '',
        proximo_retorno || null,
        status || 'Ativo',
        observacoes || ''
      ]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'create_client', JSON.stringify({ clientId: result.insertId, nome })]
    );
    
    const [newClient] = await db.query(
      'SELECT * FROM clients WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newClient[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM clients WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    const {
      nome,
      telefone,
      instagram,
      email,
      estilo_favorito,
      servico_principal,
      proximo_retorno,
      status,
      observacoes
    } = req.body;
    
    await db.query(
      `UPDATE clients 
       SET nome = ?, telefone = ?, instagram = ?, email = ?, estilo_favorito = ?, 
           servico_principal = ?, proximo_retorno = ?, status = ?, observacoes = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND studio_id = ?`,
      [
        nome || existing[0].nome,
        telefone !== undefined ? telefone : existing[0].telefone,
        instagram !== undefined ? instagram : existing[0].instagram,
        email !== undefined ? email : existing[0].email,
        estilo_favorito !== undefined ? estilo_favorito : existing[0].estilo_favorito,
        servico_principal !== undefined ? servico_principal : existing[0].servico_principal,
        proximo_retorno !== undefined ? proximo_retorno : existing[0].proximo_retorno,
        status || existing[0].status,
        observacoes !== undefined ? observacoes : existing[0].observacoes,
        req.params.id,
        req.studioId
      ]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'update_client', JSON.stringify({ clientId: req.params.id, nome })]
    );
    
    const [updated] = await db.query(
      'SELECT * FROM clients WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM clients WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await db.query(
      'DELETE FROM clients WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'delete_client', JSON.stringify({ clientId: req.params.id, nome: existing[0].nome })]
    );
    
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

router.get('/returns/scheduled', async (req, res) => {
  try {
    const [clients] = await db.query(
      `SELECT * FROM clients 
       WHERE studio_id = ? AND proximo_retorno IS NOT NULL AND proximo_retorno >= CURDATE() 
       ORDER BY proximo_retorno ASC`,
      [req.studioId]
    );
    
    res.json(clients);
  } catch (error) {
    console.error('Erro ao buscar retornos agendados:', error);
    res.status(500).json({ error: 'Erro ao buscar retornos agendados' });
  }
});

router.get('/status/fidelizados', async (req, res) => {
  try {
    const [clients] = await db.query(
      `SELECT * FROM clients 
       WHERE studio_id = ? AND status = 'Fidelizado' 
       ORDER BY total_tatuagens DESC`,
      [req.studioId]
    );
    
    res.json(clients);
  } catch (error) {
    console.error('Erro ao buscar clientes fidelizados:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes fidelizados' });
  }
});

router.get('/vip/ranking', async (req, res) => {
  try {
    const [clients] = await db.query(
      `SELECT c.*, COUNT(s.id) as total_sessions, SUM(s.valor_cobrado) as total_spent 
       FROM clients c 
       LEFT JOIN sessions s ON c.id = s.client_id 
       WHERE c.studio_id = ? 
       GROUP BY c.id 
       ORDER BY total_sessions DESC, total_spent DESC 
       LIMIT 10`,
      [req.studioId]
    );
    
    res.json(clients);
  } catch (error) {
    console.error('Erro ao buscar VIPs:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking VIP' });
  }
});

export default router;

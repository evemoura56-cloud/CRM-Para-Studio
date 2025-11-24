import express from 'express';
import { authMiddleware, multiTenantMiddleware } from '../middlewares.js';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/', async (req, res) => {
  try {
    const { clientId, status, startDate, endDate } = req.query;
    
    let query = `
      SELECT s.*, c.nome as client_nome, u.nome as artist_nome 
      FROM sessions s 
      LEFT JOIN clients c ON s.client_id = c.id 
      LEFT JOIN users u ON s.artist_id = u.id 
      WHERE s.studio_id = ?
    `;
    const params = [req.studioId];
    
    if (clientId) {
      query += ' AND s.client_id = ?';
      params.push(clientId);
    }
    
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }
    
    if (startDate) {
      query += ' AND s.data_sessao >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND s.data_sessao <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY s.data_sessao DESC';
    
    const [sessions] = await db.query(query, params);
    
    res.json(sessions);
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    res.status(500).json({ error: 'Erro ao buscar sessões' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [sessions] = await db.query(
      `SELECT s.*, c.nome as client_nome, u.nome as artist_nome 
       FROM sessions s 
       LEFT JOIN clients c ON s.client_id = c.id 
       LEFT JOIN users u ON s.artist_id = u.id 
       WHERE s.id = ? AND s.studio_id = ?`,
      [req.params.id, req.studioId]
    );
    
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    res.json(sessions[0]);
  } catch (error) {
    console.error('Erro ao buscar sessão:', error);
    res.status(500).json({ error: 'Erro ao buscar sessão' });
  }
});

router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      client_id,
      artist_id,
      data_sessao,
      tipo_sessao,
      duracao_horas,
      valor_cobrado,
      status,
      descricao_trabalho
    } = req.body;
    
    if (!client_id || !data_sessao) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cliente e data da sessão são obrigatórios' });
    }
    
    const [client] = await connection.query(
      'SELECT * FROM clients WHERE id = ? AND studio_id = ?',
      [client_id, req.studioId]
    );
    
    if (!client || client.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    const [result] = await connection.query(
      `INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.studioId,
        client_id,
        artist_id || req.userId,
        data_sessao,
        tipo_sessao || 'primeira',
        duracao_horas || 0,
        valor_cobrado || 0,
        status || 'agendada',
        descricao_trabalho || ''
      ]
    );
    
    if (status === 'realizada') {
      await connection.query(
        'UPDATE clients SET ultimo_atendimento = ?, total_tatuagens = total_tatuagens + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [data_sessao, client_id]
      );
      
      const [clientUpdated] = await connection.query(
        'SELECT total_tatuagens FROM clients WHERE id = ?',
        [client_id]
      );
      
      if (clientUpdated[0].total_tatuagens >= 4) {
        await connection.query(
          'UPDATE clients SET status = ? WHERE id = ?',
          ['Fidelizado', client_id]
        );
      }
    }
    
    await connection.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'new_session', JSON.stringify({ sessionId: result.insertId, clientId: client_id })]
    );
    
    await connection.commit();
    
    const [newSession] = await connection.query(
      `SELECT s.*, c.nome as client_nome, u.nome as artist_nome 
       FROM sessions s 
       LEFT JOIN clients c ON s.client_id = c.id 
       LEFT JOIN users u ON s.artist_id = u.id 
       WHERE s.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newSession[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ error: 'Erro ao criar sessão' });
  } finally {
    connection.release();
  }
});

router.put('/:id', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [existing] = await connection.query(
      'SELECT * FROM sessions WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    const {
      data_sessao,
      tipo_sessao,
      duracao_horas,
      valor_cobrado,
      status,
      descricao_trabalho
    } = req.body;
    
    const oldStatus = existing[0].status;
    const newStatus = status || oldStatus;
    
    await connection.query(
      `UPDATE sessions 
       SET data_sessao = ?, tipo_sessao = ?, duracao_horas = ?, valor_cobrado = ?, status = ?, descricao_trabalho = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND studio_id = ?`,
      [
        data_sessao || existing[0].data_sessao,
        tipo_sessao || existing[0].tipo_sessao,
        duracao_horas !== undefined ? duracao_horas : existing[0].duracao_horas,
        valor_cobrado !== undefined ? valor_cobrado : existing[0].valor_cobrado,
        newStatus,
        descricao_trabalho !== undefined ? descricao_trabalho : existing[0].descricao_trabalho,
        req.params.id,
        req.studioId
      ]
    );
    
    if (oldStatus !== 'realizada' && newStatus === 'realizada') {
      await connection.query(
        'UPDATE clients SET ultimo_atendimento = ?, total_tatuagens = total_tatuagens + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [data_sessao || existing[0].data_sessao, existing[0].client_id]
      );
      
      const [clientUpdated] = await connection.query(
        'SELECT total_tatuagens FROM clients WHERE id = ?',
        [existing[0].client_id]
      );
      
      if (clientUpdated[0].total_tatuagens >= 4) {
        await connection.query(
          'UPDATE clients SET status = ? WHERE id = ?',
          ['Fidelizado', existing[0].client_id]
        );
      }
    }
    
    await connection.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'update_session', JSON.stringify({ sessionId: req.params.id })]
    );
    
    await connection.commit();
    
    const [updated] = await connection.query(
      `SELECT s.*, c.nome as client_nome, u.nome as artist_nome 
       FROM sessions s 
       LEFT JOIN clients c ON s.client_id = c.id 
       LEFT JOIN users u ON s.artist_id = u.id 
       WHERE s.id = ?`,
      [req.params.id]
    );
    
    res.json(updated[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao atualizar sessão:', error);
    res.status(500).json({ error: 'Erro ao atualizar sessão' });
  } finally {
    connection.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM sessions WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    await db.query(
      'DELETE FROM sessions WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'delete_session', JSON.stringify({ sessionId: req.params.id })]
    );
    
    res.json({ message: 'Sessão removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar sessão:', error);
    res.status(500).json({ error: 'Erro ao deletar sessão' });
  }
});

export default router;

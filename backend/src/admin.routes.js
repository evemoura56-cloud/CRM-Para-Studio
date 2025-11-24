import express from 'express';
import { authMiddleware, requireRole } from '../middlewares.js';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('admin_master'));

router.get('/studios', async (req, res) => {
  try {
    const [studios] = await db.query(`
      SELECT s.*, 
        (SELECT COUNT(*) FROM users WHERE studio_id = s.id) as total_users,
        (SELECT COUNT(*) FROM clients WHERE studio_id = s.id) as total_clients
      FROM studios s 
      ORDER BY s.created_at DESC
    `);
    
    res.json(studios);
  } catch (error) {
    console.error('Erro ao buscar estúdios:', error);
    res.status(500).json({ error: 'Erro ao buscar estúdios' });
  }
});

router.get('/studios/:id', async (req, res) => {
  try {
    const [studio] = await db.query('SELECT * FROM studios WHERE id = ?', [req.params.id]);
    
    if (!studio || studio.length === 0) {
      return res.status(404).json({ error: 'Estúdio não encontrado' });
    }
    
    const [users] = await db.query('SELECT id, nome, email, role, ativo FROM users WHERE studio_id = ?', [req.params.id]);
    const [clients] = await db.query('SELECT COUNT(*) as total FROM clients WHERE studio_id = ?', [req.params.id]);
    const [sessions] = await db.query('SELECT COUNT(*) as total FROM sessions WHERE studio_id = ?', [req.params.id]);
    const [revenue] = await db.query('SELECT SUM(valor_cobrado) as total FROM sessions WHERE studio_id = ? AND status = ?', [req.params.id, 'realizada']);
    
    res.json({
      studio: studio[0],
      users,
      stats: {
        totalClients: clients[0].total,
        totalSessions: sessions[0].total,
        totalRevenue: revenue[0].total || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do estúdio:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do estúdio' });
  }
});

router.put('/studios/:id', async (req, res) => {
  try {
    const { plano_atual, ativo } = req.body;
    
    const [existing] = await db.query('SELECT * FROM studios WHERE id = ?', [req.params.id]);
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Estúdio não encontrado' });
    }
    
    await db.query(
      'UPDATE studios SET plano_atual = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        plano_atual || existing[0].plano_atual,
        ativo !== undefined ? ativo : existing[0].ativo,
        req.params.id
      ]
    );
    
    const [updated] = await db.query('SELECT * FROM studios WHERE id = ?', [req.params.id]);
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar estúdio:', error);
    res.status(500).json({ error: 'Erro ao atualizar estúdio' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [totalStudios] = await db.query('SELECT COUNT(*) as total FROM studios');
    const [activeStudios] = await db.query('SELECT COUNT(*) as total FROM studios WHERE ativo = true');
    const [totalUsers] = await db.query('SELECT COUNT(*) as total FROM users');
    const [totalClients] = await db.query('SELECT COUNT(*) as total FROM clients');
    const [totalSessions] = await db.query('SELECT COUNT(*) as total FROM sessions');
    const [totalRevenue] = await db.query('SELECT SUM(valor_cobrado) as total FROM sessions WHERE status = ?', ['realizada']);
    
    const [planDistribution] = await db.query(`
      SELECT plano_atual, COUNT(*) as total 
      FROM studios 
      WHERE ativo = true 
      GROUP BY plano_atual
    `);
    
    res.json({
      totalStudios: totalStudios[0].total,
      activeStudios: activeStudios[0].total,
      totalUsers: totalUsers[0].total,
      totalClients: totalClients[0].total,
      totalSessions: totalSessions[0].total,
      totalRevenue: totalRevenue[0].total || 0,
      planDistribution
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas globais:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const { studioId, limit = 100 } = req.query;
    
    let query = `
      SELECT l.*, s.nome_estudio, u.nome as user_nome 
      FROM activity_logs l 
      LEFT JOIN studios s ON l.studio_id = s.id 
      LEFT JOIN users u ON l.user_id = u.id
    `;
    const params = [];
    
    if (studioId) {
      query += ' WHERE l.studio_id = ?';
      params.push(studioId);
    }
    
    query += ' ORDER BY l.created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [logs] = await db.query(query, params);
    
    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

export default router;

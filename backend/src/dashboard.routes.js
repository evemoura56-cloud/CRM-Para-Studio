import express from 'express';
import { authMiddleware, multiTenantMiddleware } from '../middlewares.js';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/summary', async (req, res) => {
  try {
    const [totalClients] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ?',
      [req.studioId]
    );
    
    const [fidelizados] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ? AND status = ?',
      [req.studioId, 'Fidelizado']
    );
    
    const [agendados] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ? AND status = ?',
      [req.studioId, 'Agendado']
    );
    
    const [ativos] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ? AND status = ?',
      [req.studioId, 'Ativo']
    );
    
    const [inativos] = await db.query(
      'SELECT COUNT(*) as total FROM clients WHERE studio_id = ? AND status = ?',
      [req.studioId, 'Inativo']
    );
    
    const [avgTattoos] = await db.query(
      'SELECT AVG(total_tatuagens) as media FROM clients WHERE studio_id = ?',
      [req.studioId]
    );
    
    const [totalSessions] = await db.query(
      'SELECT COUNT(*) as total FROM sessions WHERE studio_id = ?',
      [req.studioId]
    );
    
    const [totalRevenue] = await db.query(
      'SELECT SUM(valor_cobrado) as total FROM sessions WHERE studio_id = ? AND status = ?',
      [req.studioId, 'realizada']
    );
    
    const [recentClients] = await db.query(
      'SELECT * FROM clients WHERE studio_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.studioId]
    );
    
    const [upcomingSessions] = await db.query(
      `SELECT s.*, c.nome as client_nome, u.nome as artist_nome 
       FROM sessions s 
       LEFT JOIN clients c ON s.client_id = c.id 
       LEFT JOIN users u ON s.artist_id = u.id 
       WHERE s.studio_id = ? AND s.status = ? AND s.data_sessao >= CURDATE() 
       ORDER BY s.data_sessao ASC 
       LIMIT 5`,
      [req.studioId, 'agendada']
    );
    
    res.json({
      summary: {
        totalClients: totalClients[0].total,
        fidelizados: fidelizados[0].total,
        agendados: agendados[0].total,
        ativos: ativos[0].total,
        inativos: inativos[0].total,
        mediaTattoos: parseFloat(avgTattoos[0].media || 0).toFixed(1),
        totalSessions: totalSessions[0].total,
        totalRevenue: parseFloat(totalRevenue[0].total || 0).toFixed(2)
      },
      recentClients,
      upcomingSessions
    });
  } catch (error) {
    console.error('Erro ao buscar resumo do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo do dashboard' });
  }
});

router.get('/stats/monthly', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const [monthlyData] = await db.query(
      `SELECT 
        MONTH(data_sessao) as mes, 
        COUNT(*) as total_sessions, 
        SUM(valor_cobrado) as receita 
       FROM sessions 
       WHERE studio_id = ? AND YEAR(data_sessao) = ? AND status = ? 
       GROUP BY MONTH(data_sessao) 
       ORDER BY MONTH(data_sessao)`,
      [req.studioId, year, 'realizada']
    );
    
    res.json(monthlyData);
  } catch (error) {
    console.error('Erro ao buscar estatísticas mensais:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas mensais' });
  }
});

router.get('/stats/artists', async (req, res) => {
  try {
    const [artistStats] = await db.query(
      `SELECT 
        u.id, 
        u.nome, 
        COUNT(s.id) as total_sessions, 
        SUM(s.valor_cobrado) as receita_total 
       FROM users u 
       LEFT JOIN sessions s ON u.id = s.artist_id AND s.status = ? 
       WHERE u.studio_id = ? AND (u.role = ? OR u.role = ?) 
       GROUP BY u.id, u.nome 
       ORDER BY total_sessions DESC`,
      ['realizada', req.studioId, 'owner', 'artist']
    );
    
    res.json(artistStats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas de artistas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de artistas' });
  }
});

export default router;

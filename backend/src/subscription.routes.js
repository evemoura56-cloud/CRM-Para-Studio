import express from 'express';
import { authMiddleware, multiTenantMiddleware, requireRole } from '../middlewares.js';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/', requireRole('owner'), async (req, res) => {
  try {
    const [subscription] = await db.query(
      `SELECT s.*, st.nome_estudio, st.email_contato 
       FROM subscriptions s 
       LEFT JOIN studios st ON s.studio_id = st.id 
       WHERE s.studio_id = ? 
       ORDER BY s.created_at DESC 
       LIMIT 1`,
      [req.studioId]
    );
    
    if (!subscription || subscription.length === 0) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    res.json(subscription[0]);
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({ error: 'Erro ao buscar assinatura' });
  }
});

router.post('/upgrade', requireRole('owner'), async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { plano, metodo_pagamento } = req.body;
    
    if (!['free', 'pro', 'premium'].includes(plano)) {
      await connection.rollback();
      return res.status(400).json({ error: 'Plano inválido' });
    }
    
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio);
    dataFim.setMonth(dataFim.getMonth() + 1);
    
    const valores = { free: 0, pro: 97, premium: 197 };
    const valorMensal = valores[plano];
    
    await connection.query(
      'UPDATE studios SET plano_atual = ?, data_inicio_plano = ?, data_fim_plano = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [plano, dataInicio, dataFim, req.studioId]
    );
    
    await connection.query(
      `INSERT INTO subscriptions (studio_id, plano, status, metodo_pagamento, valor_mensal, data_inicio, data_fim) 
       VALUES (?, ?, 'ativo', ?, ?, ?, ?)`,
      [req.studioId, plano, metodo_pagamento || 'simulado', valorMensal, dataInicio, dataFim]
    );
    
    await connection.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'upgrade_plan', JSON.stringify({ plano, valorMensal })]
    );
    
    await connection.commit();
    
    res.json({
      message: `Plano ${plano.toUpperCase()} ativado com sucesso!`,
      plano,
      valorMensal,
      dataInicio,
      dataFim
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao fazer upgrade:', error);
    res.status(500).json({ error: 'Erro ao fazer upgrade do plano' });
  } finally {
    connection.release();
  }
});

router.post('/cancel', requireRole('owner'), async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query(
      `UPDATE subscriptions 
       SET status = 'cancelado', updated_at = CURRENT_TIMESTAMP 
       WHERE studio_id = ? AND status = 'ativo'`,
      [req.studioId]
    );
    
    await connection.query(
      'UPDATE studios SET plano_atual = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['free', req.studioId]
    );
    
    await connection.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'cancel_subscription', JSON.stringify({ reason: req.body.reason || 'Não informado' })]
    );
    
    await connection.commit();
    
    res.json({ message: 'Assinatura cancelada. Você foi movido para o plano Free.' });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  } finally {
    connection.release();
  }
});

router.post('/payment/simulate', requireRole('owner'), async (req, res) => {
  try {
    const { plano, metodo } = req.body;
    
    const valores = { free: 0, pro: 97, premium: 197 };
    const valor = valores[plano] || 0;
    
    const simulacao = {
      success: true,
      transactionId: `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      plano,
      metodo: metodo || 'simulado',
      valor,
      status: 'aprovado',
      message: 'Pagamento simulado com sucesso',
      timestamp: new Date().toISOString()
    };
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'simulate_payment', JSON.stringify(simulacao)]
    );
    
    res.json(simulacao);
  } catch (error) {
    console.error('Erro ao simular pagamento:', error);
    res.status(500).json({ error: 'Erro ao simular pagamento' });
  }
});

export default router;

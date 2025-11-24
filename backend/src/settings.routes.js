import express from 'express';
import { authMiddleware, multiTenantMiddleware, requireRole } from '../middlewares.js';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/', async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT * FROM settings WHERE studio_id = ?',
      [req.studioId]
    );
    
    if (!settings || settings.length === 0) {
      return res.status(404).json({ error: 'Configurações não encontradas' });
    }
    
    res.json(settings[0]);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

router.put('/', requireRole('owner'), async (req, res) => {
  try {
    const {
      cor_neon,
      brilho_neon,
      efeito_piscar_neon,
      lembretes_whatsapp_ativos,
      dias_antecedencia_lembrete
    } = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM settings WHERE studio_id = ?',
      [req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      await db.query(
        `INSERT INTO settings (studio_id, cor_neon, brilho_neon, efeito_piscar_neon, lembretes_whatsapp_ativos, dias_antecedencia_lembrete) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.studioId,
          cor_neon || '#FF0000',
          brilho_neon || 80,
          efeito_piscar_neon || false,
          lembretes_whatsapp_ativos !== undefined ? lembretes_whatsapp_ativos : true,
          dias_antecedencia_lembrete || 3
        ]
      );
    } else {
      await db.query(
        `UPDATE settings 
         SET cor_neon = ?, brilho_neon = ?, efeito_piscar_neon = ?, lembretes_whatsapp_ativos = ?, dias_antecedencia_lembrete = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE studio_id = ?`,
        [
          cor_neon || existing[0].cor_neon,
          brilho_neon !== undefined ? brilho_neon : existing[0].brilho_neon,
          efeito_piscar_neon !== undefined ? efeito_piscar_neon : existing[0].efeito_piscar_neon,
          lembretes_whatsapp_ativos !== undefined ? lembretes_whatsapp_ativos : existing[0].lembretes_whatsapp_ativos,
          dias_antecedencia_lembrete || existing[0].dias_antecedencia_lembrete,
          req.studioId
        ]
      );
    }
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'update_settings', JSON.stringify(req.body)]
    );
    
    const [updated] = await db.query(
      'SELECT * FROM settings WHERE studio_id = ?',
      [req.studioId]
    );
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

export default router;

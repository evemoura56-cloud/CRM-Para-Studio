import express from 'express';
import { authMiddleware, multiTenantMiddleware } from '../middlewares.js';
import bcrypt from 'bcryptjs';
import db from '../database.js';

const router = express.Router();

router.use(authMiddleware);
router.use(multiTenantMiddleware);

router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, nome, email, role, ativo, created_at FROM users WHERE studio_id = ?',
      [req.studioId]
    );
    
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Apenas o proprietário pode adicionar usuários' });
    }
    
    const { nome, email, senha, role } = req.body;
    
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (!['artist', 'assistant'].includes(role)) {
      return res.status(400).json({ error: 'Role inválida' });
    }
    
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? AND studio_id = ?',
      [email, req.studioId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado neste estúdio' });
    }
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (studio_id, nome, email, senha_hash, role, ativo) VALUES (?, ?, ?, ?, ?, true)',
      [req.studioId, nome, email, senhaHash, role]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'create_user', JSON.stringify({ newUserId: result.insertId, nome, role })]
    );
    
    const [newUser] = await db.query(
      'SELECT id, nome, email, role, ativo, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Apenas o proprietário pode editar usuários' });
    }
    
    const { nome, email, role, ativo } = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM users WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await db.query(
      `UPDATE users 
       SET nome = ?, email = ?, role = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND studio_id = ?`,
      [
        nome || existing[0].nome,
        email || existing[0].email,
        role || existing[0].role,
        ativo !== undefined ? ativo : existing[0].ativo,
        req.params.id,
        req.studioId
      ]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'update_user', JSON.stringify({ updatedUserId: req.params.id })]
    );
    
    const [updated] = await db.query(
      'SELECT id, nome, email, role, ativo, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Apenas o proprietário pode remover usuários' });
    }
    
    if (parseInt(req.params.id) === parseInt(req.userId)) {
      return res.status(400).json({ error: 'Você não pode remover sua própria conta' });
    }
    
    const [existing] = await db.query(
      'SELECT * FROM users WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await db.query(
      'DELETE FROM users WHERE id = ? AND studio_id = ?',
      [req.params.id, req.studioId]
    );
    
    await db.query(
      'INSERT INTO activity_logs (studio_id, user_id, tipo_acao, detalhes) VALUES (?, ?, ?, ?)',
      [req.studioId, req.userId, 'delete_user', JSON.stringify({ deletedUserId: req.params.id, nome: existing[0].nome })]
    );
    
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;

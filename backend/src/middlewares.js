import jwt from 'jsonwebtoken';
import config from '../config.js';
import db from '../database.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      const [users] = await db.query(
        'SELECT id, studio_id, nome, email, role, ativo FROM users WHERE id = ?',
        [decoded.userId]
      );
      
      if (!users || users.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      const user = users[0];
      
      if (!user.ativo) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }
      
      req.user = user;
      req.userId = user.id;
      req.studioId = user.studio_id;
      req.userRole = user.role;
      
      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ error: 'Erro ao verificar autenticação' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.',
        requiredRoles: allowedRoles 
      });
    }
    next();
  };
};

export const multiTenantMiddleware = async (req, res, next) => {
  if (req.userRole === 'admin_master') {
    return next();
  }
  
  if (!req.studioId) {
    return res.status(400).json({ error: 'Studio ID não identificado' });
  }
  
  try {
    const [studios] = await db.query(
      'SELECT id, ativo, plano_atual FROM studios WHERE id = ?',
      [req.studioId]
    );
    
    if (!studios || studios.length === 0) {
      return res.status(404).json({ error: 'Estúdio não encontrado' });
    }
    
    const studio = studios[0];
    
    if (!studio.ativo) {
      return res.status(403).json({ error: 'Estúdio inativo' });
    }
    
    req.studioPlan = studio.plano_atual;
    
    next();
  } catch (error) {
    console.error('Erro no middleware multi-tenant:', error);
    return res.status(500).json({ error: 'Erro ao verificar estúdio' });
  }
};

export const checkPlanFeature = (feature) => {
  return (req, res, next) => {
    const plan = req.studioPlan || 'free';
    const planConfig = config.plans[plan];
    
    if (!planConfig) {
      return res.status(400).json({ error: 'Plano inválido' });
    }
    
    if (!planConfig.features.includes(feature)) {
      return res.status(403).json({ 
        error: 'Funcionalidade não disponível no seu plano atual',
        feature,
        currentPlan: plan,
        upgradeRequired: true 
      });
    }
    
    next();
  };
};

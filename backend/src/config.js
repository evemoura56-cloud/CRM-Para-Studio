import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'inkhouse_secret_key_change_this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'inkhouse_crm'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  plans: {
    free: {
      name: 'Free',
      maxClients: 15,
      features: ['basic_dashboard'],
      price: 0
    },
    pro: {
      name: 'Pro',
      maxClients: -1,
      features: ['basic_dashboard', 'kanban', 'returns', 'vip', 'csv_export', 'mobile_app', 'custom_neon_limited'],
      price: 97
    },
    premium: {
      name: 'Premium',
      maxClients: -1,
      features: ['basic_dashboard', 'kanban', 'returns', 'vip', 'csv_export', 'pdf_export', 'mobile_app', 'custom_neon_full', 'activity_logs', 'vip_advanced', 'priority_support'],
      price: 197
    }
  }
};

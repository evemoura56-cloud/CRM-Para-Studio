-- ============================================================================
-- INKHOUSE CRM - Database Schema (MySQL)
-- "Tatuagens contam histórias. O CRM guarda todas elas."
-- ============================================================================
--
-- Justificativa da escolha do MySQL:
-- 1. Amplamente disponível em hospedagens compartilhadas e VPS
-- 2. Desempenho excelente para aplicações SaaS multi-tenant
-- 3. Fácil instalação local (XAMPP, WAMP, Docker)
-- 4. Suporte nativo a JSON (desde MySQL 5.7+)
-- 5. Custo-benefício superior para pequenos e médios estúdios
-- 6. Ferramentas de administração acessíveis (phpMyAdmin, MySQL Workbench)
--
-- ============================================================================

DROP DATABASE IF EXISTS inkhouse_crm;
CREATE DATABASE inkhouse_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inkhouse_crm;


-- ============================================================================
-- Tabela: studios (Estúdios de Tatuagem)
-- Multi-tenant: Cada estúdio é um tenant isolado
-- ============================================================================

CREATE TABLE studios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_estudio VARCHAR(255) NOT NULL,
  slug_subdominio VARCHAR(64) UNIQUE NOT NULL,
  email_contato VARCHAR(255),
  telefone VARCHAR(64),
  endereco VARCHAR(255),
  plano_atual ENUM('free', 'pro', 'premium') NOT NULL DEFAULT 'free',
  data_inicio_plano DATETIME,
  data_fim_plano DATETIME,
  ativo BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug_subdominio),
  INDEX idx_plano (plano_atual),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: users (Usuários do Sistema)
-- Roles: owner, artist, assistant, admin_master
-- ============================================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role ENUM('owner', 'artist', 'assistant', 'admin_master') NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email_per_studio (studio_id, email),
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  INDEX idx_studio (studio_id),
  INDEX idx_role (role),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: clients (Clientes dos Estúdios)
-- ============================================================================

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(64),
  instagram VARCHAR(128),
  email VARCHAR(255),
  estilo_favorito VARCHAR(128),
  servico_principal VARCHAR(128),
  ultimo_atendimento DATE,
  proximo_retorno DATE,
  status ENUM('Ativo', 'Inativo', 'Agendado', 'Fidelizado') DEFAULT 'Ativo',
  total_tatuagens INT DEFAULT 0,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  INDEX idx_studio (studio_id),
  INDEX idx_status (status),
  INDEX idx_nome (nome),
  INDEX idx_proximo_retorno (proximo_retorno)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: sessions (Sessões de Tatuagem)
-- ============================================================================

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT NOT NULL,
  client_id INT NOT NULL,
  artist_id INT,
  data_sessao DATE,
  tipo_sessao ENUM('primeira', 'continuidade', 'retoque') DEFAULT 'primeira',
  duracao_horas DECIMAL(5,2) DEFAULT 0,
  valor_cobrado DECIMAL(10,2) DEFAULT 0,
  status ENUM('realizada', 'agendada', 'cancelada') DEFAULT 'agendada',
  descricao_trabalho TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_studio (studio_id),
  INDEX idx_client (client_id),
  INDEX idx_artist (artist_id),
  INDEX idx_data (data_sessao),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: subscriptions (Assinaturas SaaS)
-- ============================================================================

CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT NOT NULL,
  plano ENUM('free', 'pro', 'premium') NOT NULL,
  status ENUM('ativo', 'cancelado', 'trial', 'pendente_pagamento') NOT NULL,
  metodo_pagamento VARCHAR(32),
  valor_mensal DECIMAL(10,2) DEFAULT 0,
  data_inicio DATE,
  data_fim DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  INDEX idx_studio (studio_id),
  INDEX idx_status (status),
  INDEX idx_plano (plano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: activity_logs (Logs de Atividades)
-- ============================================================================

CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT,
  user_id INT,
  tipo_acao VARCHAR(64),
  detalhes JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_studio (studio_id),
  INDEX idx_user (user_id),
  INDEX idx_tipo (tipo_acao),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tabela: settings (Configurações do Estúdio)
-- ============================================================================

CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studio_id INT NOT NULL UNIQUE,
  cor_neon VARCHAR(16) DEFAULT '#FF0000',
  brilho_neon INT DEFAULT 80 CHECK (brilho_neon >= 0 AND brilho_neon <= 100),
  efeito_piscar_neon BOOLEAN DEFAULT FALSE,
  lembretes_whatsapp_ativos BOOLEAN DEFAULT TRUE,
  dias_antecedencia_lembrete INT DEFAULT 3,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
  INDEX idx_studio (studio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SEED DATA: Studios, Users, Subscriptions, Settings
-- ============================================================================

-- Senha padrão para todos os usuários de teste: "senha123"
-- Hash bcrypt: $2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C

INSERT INTO studios (id, nome_estudio, slug_subdominio, email_contato, telefone, endereco, plano_atual, data_inicio_plano, data_fim_plano, ativo) VALUES
(1, 'Skull King Ink', 'skullking', 'contato@skullking.ink', '+55 11 90000-0001', 'Av. do Rock, 666 - São Paulo/SP', 'premium', '2024-01-01 00:00:00', '2025-01-01 00:00:00', TRUE),
(2, 'Black Rose Atelier', 'blackrose', 'contato@blackrose.ink', '+55 21 90000-0002', 'Rua das Rosas, 13 - Rio de Janeiro/RJ', 'pro', '2024-01-01 00:00:00', '2025-01-01 00:00:00', TRUE),
(3, 'Night Owl Tattoo', 'nightowl', 'hello@nightowl.ink', '+55 31 90000-0003', 'Alameda Noturna, 77 - Belo Horizonte/MG', 'pro', '2024-01-01 00:00:00', '2025-01-01 00:00:00', TRUE),
(4, 'Crimson Lab', 'crimsonlab', 'oi@crimsonlab.ink', '+55 41 90000-0004', 'Rua Vermelha, 404 - Curitiba/PR', 'free', '2024-11-01 00:00:00', '2024-11-08 00:00:00', TRUE),
(5, 'Void Walker Studio', 'voidwalker', 'dark@voidwalker.ink', '+55 61 90000-0005', 'Setor Subsolo, 101 - Brasília/DF', 'premium', '2024-01-01 00:00:00', '2025-01-01 00:00:00', TRUE);

INSERT INTO users (id, studio_id, nome, email, senha_hash, role, ativo) VALUES
(1, 1, 'Magnus Skull', 'owner@skullking.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'owner', TRUE),
(2, 1, 'Raven Dark', 'artist@skullking.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'artist', TRUE),
(3, 2, 'Rosa Negra', 'owner@blackrose.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'owner', TRUE),
(4, 2, 'Luna Espinhos', 'artist@blackrose.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'artist', TRUE),
(5, 3, 'Coruja Noturna', 'owner@nightowl.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'owner', TRUE),
(6, 4, 'Crimson Master', 'owner@crimsonlab.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'owner', TRUE),
(7, 5, 'Void Shadow', 'owner@voidwalker.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'owner', TRUE),
(8, 5, 'Dark Walker', 'artist@voidwalker.ink', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'artist', TRUE),
(99, NULL, 'Evelyn Moura', 'admin@inkhouse.com', '$2a$10$RuwZ0pniS3pS3kMt2rtI9uQ0qtEtFPi0PfrxGX2YeliYg5OtTS//C', 'admin_master', TRUE);

INSERT INTO subscriptions (studio_id, plano, status, metodo_pagamento, valor_mensal, data_inicio, data_fim) VALUES
(1, 'premium', 'ativo', 'pix_simulado', 197.00, '2024-01-01', '2025-01-01'),
(2, 'pro', 'ativo', 'stripe', 97.00, '2024-01-01', '2025-01-01'),
(3, 'pro', 'ativo', 'pagseguro', 97.00, '2024-01-01', '2025-01-01'),
(4, 'free', 'trial', 'none', 0.00, '2024-11-01', '2024-11-08'),
(5, 'premium', 'ativo', 'pix_simulado', 197.00, '2024-01-01', '2025-01-01');

INSERT INTO settings (studio_id, cor_neon, brilho_neon, efeito_piscar_neon, lembretes_whatsapp_ativos, dias_antecedencia_lembrete) VALUES
(1, '#FF0000', 90, TRUE, TRUE, 3),
(2, '#FF0000', 75, FALSE, TRUE, 3),
(3, '#FF0000', 80, TRUE, TRUE, 2),
(4, '#FF0000', 60, FALSE, FALSE, 3),
(5, '#FF0000', 95, TRUE, TRUE, 3);


-- ============================================================================
-- SEED DATA: Clients (15-20 por estúdio)
-- ============================================================================

-- Studio 1: Skull King Ink (Premium) - Clientes com estilo dark/rock
INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, ultimo_atendimento, proximo_retorno, status, total_tatuagens, observacoes) VALUES
(1, 'Rafael "Skull" Santos', '+55 11 98765-4321', '@rafael_skull', 'rafael@email.com', 'Blackwork', 'Tatuagem grande costas', '2024-10-15', '2025-01-15', 'Fidelizado', 6, 'Cliente VIP, preferência por trabalhos grandes'),
(1, 'Luna Dark Rose', '+55 11 98765-4322', '@luna_darkrose', 'luna@email.com', 'Neo Traditional', 'Braço fechado', '2024-11-01', '2024-12-01', 'Agendado', 3, 'Gosta de rosas e caveiras'),
(1, 'Diego "Mad Ink" Silva', '+55 11 98765-4323', '@diego_madink', 'diego@email.com', 'Trash Polka', 'Perna completa', '2024-11-10', NULL, 'Ativo', 4, 'Sempre traz referências de filmes de terror'),
(1, 'Amanda Serpent Queen', '+55 11 98765-4324', '@amanda_serpent', 'amanda@email.com', 'Realismo', 'Cobra no braço', '2024-09-20', NULL, 'Ativo', 2, 'Prefere sessões longas'),
(1, 'Carlos "Iron Hand" Souza', '+55 11 98765-4325', '@carlos_ironhand', 'carlos@email.com', 'Old School', 'Antebraço', '2024-08-05', NULL, 'Inativo', 5, 'Cliente antigo, precisa reativar'),
(1, 'Bianca Red Witch', '+55 11 98765-4326', '@bianca_redwitch', 'bianca@email.com', 'Blackwork', 'Costas completa', '2024-11-15', '2024-12-15', 'Fidelizado', 7, 'VIP - projeto de 1 ano em andamento'),
(1, 'Pedro Black Venom', '+55 11 98765-4327', '@pedro_venom', 'pedro@email.com', 'Fineline', 'Dedos e mãos', '2024-11-18', '2025-02-18', 'Ativo', 3, 'Trabalha com design gráfico'),
(1, 'Julia Phoenix Fire', '+55 11 98765-4328', '@julia_phoenix', 'julia@email.com', 'Aquarela', 'Costela', '2024-10-30', '2024-12-20', 'Agendado', 2, 'Primeira sessão foi ótima'),
(1, 'Rodrigo Steel Wolf', '+55 11 98765-4329', '@rodrigo_steelwolf', 'rodrigo@email.com', 'Realismo', 'Peito', '2024-11-20', NULL, 'Ativo', 4, 'Quer fechar o peito inteiro'),
(1, 'Mariana Night Owl', '+55 11 98765-4330', '@mariana_nightowl', 'mariana@email.com', 'Ornamental', 'Braço mandala', '2024-11-12', '2025-01-12', 'Fidelizado', 5, 'Adora mandalas e geometria'),
(1, 'Thiago Raven Dark', '+55 11 98765-4331', '@thiago_raven', 'thiago@email.com', 'Tribal', 'Ombro', '2024-07-10', NULL, 'Inativo', 2, 'Sumiu há meses'),
(1, 'Camila Sugar Death', '+55 11 98765-4332', '@camila_sugardeath', 'camila@email.com', 'Neo Traditional', 'Coxa', '2024-11-22', '2024-12-25', 'Ativo', 3, 'Estilo mexicano, caveiras coloridas'),
(1, 'Felipe Thunder Bolt', '+55 11 98765-4333', '@felipe_thunder', 'felipe@email.com', 'Blackwork', 'Braço completo', '2024-11-05', '2025-02-05', 'Fidelizado', 6, 'Projeto de sleeve em andamento'),
(1, 'Isabela Moon Shadow', '+55 11 98765-4334', '@isabela_moon', 'isabela@email.com', 'Fineline', 'Costela', '2024-11-25', NULL, 'Ativo', 1, 'Primeira tattoo, muito animada'),
(1, 'Gabriel Void Walker', '+55 11 98765-4335', '@gabriel_void', 'gabriel@email.com', 'Abstrato', 'Costas', '2024-10-01', NULL, 'Ativo', 4, 'Gosta de arte abstrata e minimalista'),
(1, 'Patricia Wild Cat', '+55 11 98765-4336', '@patricia_wildcat', 'patricia@email.com', 'Realismo', 'Panturrilha', '2024-11-28', '2025-01-28', 'Agendado', 2, 'Quer tatuar felinos'),
(1, 'Bruno Ink Warrior', '+55 11 98765-4337', '@bruno_warrior', 'bruno@email.com', 'Maori', 'Perna', '2024-06-15', NULL, 'Inativo', 3, 'Cliente antigo'),
(1, 'Vanessa Black Widow', '+55 11 98765-4338', '@vanessa_blackwidow', 'vanessa@email.com', 'Neo Traditional', 'Braço', '2024-11-10', '2024-12-10', 'Fidelizado', 5, 'Tema: aranhas e teias'),
(1, 'Leonardo Dark Arts', '+55 11 98765-4339', '@leo_darkarts', 'leo@email.com', 'Horror', 'Perna completa', '2024-11-01', '2025-03-01', 'Ativo', 7, 'Colecionador de tattoos de terror'),
(1, 'Sofia Iron Lotus', '+55 11 98765-4340', '@sofia_ironlotus', 'sofia@email.com', 'Oriental', 'Costas', '2024-11-20', '2025-02-20', 'Fidelizado', 8, 'Projeto oriental grande');

-- Studio 2: Black Rose Atelier (Pro) - Estilo elegante/floral
INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, ultimo_atendimento, proximo_retorno, status, total_tatuagens, observacoes) VALUES
(2, 'Valentina Rose', '+55 21 98765-5001', '@valentina_rose', 'valentina@email.com', 'Neo Traditional', 'Rosas no braço', '2024-11-15', '2024-12-15', 'Fidelizado', 5, 'Adora rosas vermelhas'),
(2, 'Isabella Noir', '+55 21 98765-5002', '@isabella_noir', 'isabella@email.com', 'Fineline', 'Flores delicadas', '2024-11-10', NULL, 'Ativo', 2, 'Primeira cliente do estúdio'),
(2, 'Antônio Espinhos', '+55 21 98765-5003', '@antonio_espinhos', 'antonio@email.com', 'Blackwork', 'Caveira floral', '2024-10-20', NULL, 'Ativo', 3, 'Mistura dark com floral'),
(2, 'Beatriz Pétala', '+55 21 98765-5004', '@beatriz_petala', 'beatriz@email.com', 'Aquarela', 'Flores aquarela', '2024-11-20', '2025-01-20', 'Agendado', 1, 'Queria algo colorido e suave'),
(2, 'Renato Black Garden', '+55 21 98765-5005', '@renato_blackgarden', 'renato@email.com', 'Neo Traditional', 'Jardim negro', '2024-09-15', NULL, 'Inativo', 2, 'Não retornou'),
(2, 'Lívia Moonflower', '+55 21 98765-5006', '@livia_moonflower', 'livia@email.com', 'Ornamental', 'Mandala floral', '2024-11-18', '2025-02-18', 'Fidelizado', 4, 'Projeto de braço em andamento'),
(2, 'César Wild Rose', '+55 21 98765-5007', '@cesar_wildrose', 'cesar@email.com', 'Neo Traditional', 'Rosa e relógio', '2024-11-12', NULL, 'Ativo', 3, 'Estilo vitoriano'),
(2, 'Mariana Fleur', '+55 21 98765-5008', '@mariana_fleur', 'mariana@email.com', 'Fineline', 'Bouquet delicado', '2024-11-22', '2024-12-22', 'Agendado', 2, 'Prefere traços finos'),
(2, 'Paulo Dark Bloom', '+55 21 98765-5009', '@paulo_darkbloom', 'paulo@email.com', 'Blackwork', 'Flores mortas', '2024-11-05', '2025-01-05', 'Ativo', 4, 'Temática gótica'),
(2, 'Ana Garden Soul', '+55 21 98765-5010', '@ana_gardensoul', 'ana@email.com', 'Botânica', 'Plantas nativas', '2024-11-25', NULL, 'Ativo', 1, 'Bióloga, ama plantas'),
(2, 'Roberto Thorn King', '+55 21 98765-5011', '@roberto_thornking', 'roberto@email.com', 'Neo Traditional', 'Coroa de espinhos', '2024-08-01', NULL, 'Inativo', 2, 'Mudou de cidade'),
(2, 'Juliana Velvet Rose', '+55 21 98765-5012', '@juliana_velvetrose', 'juliana@email.com', 'Realismo', 'Rosas realistas', '2024-11-20', '2024-12-28', 'Fidelizado', 6, 'Quer fechar o braço com rosas'),
(2, 'Diego Noir Garden', '+55 21 98765-5013', '@diego_noirgarden', 'diego@email.com', 'Ornamental', 'Jardim secreto', '2024-11-10', '2025-02-10', 'Ativo', 3, 'Projeto de costas'),
(2, 'Camila Petal Shadow', '+55 21 98765-5014', '@camila_petalshadow', 'camila@email.com', 'Aquarela', 'Flores sombreadas', '2024-11-28', NULL, 'Ativo', 2, 'Estilo único e artístico'),
(2, 'Fernando Rose Skull', '+55 21 98765-5015', '@fernando_roseskull', 'fernando@email.com', 'Neo Traditional', 'Caveira com rosas', '2024-11-01', '2025-01-15', 'Fidelizado', 5, 'Clássico old school'),
(2, 'Larissa Moon Petal', '+55 21 98765-5016', '@larissa_moonpetal', 'larissa@email.com', 'Fineline', 'Lua e flores', '2024-11-23', '2024-12-30', 'Agendado', 1, 'Simbolismo lunar');

-- Studio 3: Night Owl Tattoo (Pro)
INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, ultimo_atendimento, proximo_retorno, status, total_tatuagens, observacoes) VALUES
(3, 'Marcus Night Watch', '+55 31 98765-6001', '@marcus_nightwatch', 'marcus@email.com', 'Realismo', 'Coruja realista', '2024-11-16', '2025-01-16', 'Fidelizado', 4, 'Coleção de corujas'),
(3, 'Helena Moonlight', '+55 31 98765-6002', '@helena_moonlight', 'helena@email.com', 'Fineline', 'Lua e estrelas', '2024-11-12', NULL, 'Ativo', 2, 'Tema celestial'),
(3, 'Bruno Dark Wings', '+55 31 98765-6003', '@bruno_darkwings', 'bruno@email.com', 'Blackwork', 'Asas de coruja', '2024-10-25', NULL, 'Ativo', 3, 'Projeto de costas'),
(3, 'Carla Stargazer', '+55 31 98765-6004', '@carla_stargazer', 'carla@email.com', 'Pontilhismo', 'Constelações', '2024-11-20', '2024-12-20', 'Agendado', 1, 'Astrônoma amadora'),
(3, 'Rafael Nocturnal', '+55 31 98765-6005', '@rafael_nocturnal', 'rafael@email.com', 'Neo Traditional', 'Coruja colorida', '2024-09-10', NULL, 'Inativo', 2, 'Não retornou'),
(3, 'Júlia Night Sky', '+55 31 98765-6006', '@julia_nightsky', 'julia@email.com', 'Aquarela', 'Céu noturno', '2024-11-18', '2025-02-18', 'Fidelizado', 5, 'Projeto de perna'),
(3, 'Pedro Eclipse', '+55 31 98765-6007', '@pedro_eclipse', 'pedro@email.com', 'Geométrico', 'Eclipse lunar', '2024-11-15', NULL, 'Ativo', 3, 'Designer gráfico'),
(3, 'Amanda Owl Spirit', '+55 31 98765-6008', '@amanda_owlspirit', 'amanda@email.com', 'Tribal', 'Coruja tribal', '2024-11-22', '2024-12-22', 'Agendado', 2, 'Conexão espiritual'),
(3, 'Thiago Midnight', '+55 31 98765-6009', '@thiago_midnight', 'thiago@email.com', 'Blackwork', 'Noite sombria', '2024-11-08', '2025-01-08', 'Ativo', 4, 'Temática dark'),
(3, 'Beatriz Starlight', '+55 31 98765-6010', '@beatriz_starlight', 'beatriz@email.com', 'Fineline', 'Estrelas delicadas', '2024-11-25', NULL, 'Ativo', 1, 'Primeira tattoo'),
(3, 'Lucas Night Hunter', '+55 31 98765-6011', '@lucas_nighthunter', 'lucas@email.com', 'Realismo', 'Lobo noturno', '2024-07-20', NULL, 'Inativo', 2, 'Cliente antigo'),
(3, 'Fernanda Moon Witch', '+55 31 98765-6012', '@fernanda_moonwitch', 'fernanda@email.com', 'Neo Traditional', 'Bruxa da lua', '2024-11-20', '2024-12-28', 'Fidelizado', 6, 'Coleção mística'),
(3, 'Gabriel Shadow Owl', '+55 31 98765-6013', '@gabriel_shadowowl', 'gabriel@email.com', 'Blackwork', 'Coruja sombria', '2024-11-10', '2025-02-10', 'Ativo', 3, 'Estilo gótico'),
(3, 'Sofia Celestial', '+55 31 98765-6014', '@sofia_celestial', 'sofia@email.com', 'Aquarela', 'Universo', '2024-11-28', NULL, 'Ativo', 2, 'Fascinada por cosmos'),
(3, 'Ricardo Night Raven', '+55 31 98765-6015', '@ricardo_nightraven', 'ricardo@email.com', 'Realismo', 'Corvo negro', '2024-11-05', '2025-01-15', 'Fidelizado', 5, 'Poe fan');

-- Studio 4: Crimson Lab (Free - limite 15 clientes)
INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, ultimo_atendimento, proximo_retorno, status, total_tatuagens, observacoes) VALUES
(4, 'Ana Red Lab', '+55 41 98765-7001', '@ana_redlab', 'ana@email.com', 'Experimental', 'Arte abstrata', '2024-11-10', NULL, 'Ativo', 1, 'Gosta de experimentar'),
(4, 'Carlos Crimson', '+55 41 98765-7002', '@carlos_crimson', 'carlos@email.com', 'Minimalista', 'Símbolos simples', '2024-11-15', '2024-12-15', 'Agendado', 2, 'Prefere minimalismo'),
(4, 'Beatriz Blood Art', '+55 41 98765-7003', '@beatriz_bloodart', 'beatriz@email.com', 'Aquarela', 'Manchas vermelhas', '2024-10-20', NULL, 'Ativo', 1, 'Artista plástica'),
(4, 'Diego Lab Test', '+55 41 98765-7004', '@diego_labtest', 'diego@email.com', 'Geométrico', 'Formas geométricas', '2024-11-18', NULL, 'Ativo', 3, 'Arquiteto'),
(4, 'Fernanda Scarlet', '+55 41 98765-7005', '@fernanda_scarlet', 'fernanda@email.com', 'Neo Traditional', 'Flores vermelhas', '2024-09-05', NULL, 'Inativo', 1, 'Não retornou'),
(4, 'Gabriel Red Ink', '+55 41 98765-7006', '@gabriel_redink', 'gabriel@email.com', 'Blackwork', 'Tinta vermelha', '2024-11-20', '2025-01-20', 'Fidelizado', 4, 'Cliente frequente'),
(4, 'Helena Crimson Rose', '+55 41 98765-7007', '@helena_crimsonrose', 'helena@email.com', 'Fineline', 'Rosa crimson', '2024-11-12', NULL, 'Ativo', 2, 'Delicada e elegante'),
(4, 'Igor Blood Moon', '+55 41 98765-7008', '@igor_bloodmoon', 'igor@email.com', 'Horror', 'Lua sangrenta', '2024-11-22', '2024-12-22', 'Agendado', 1, 'Fã de terror'),
(4, 'Júlia Lab Ink', '+55 41 98765-7009', '@julia_labink', 'julia@email.com', 'Abstrato', 'Experimento', '2024-11-05', NULL, 'Ativo', 2, 'Quer algo único'),
(4, 'Leonardo Vermelho', '+55 41 98765-7010', '@leo_vermelho', 'leo@email.com', 'Tribal', 'Tribal vermelho', '2024-11-25', NULL, 'Ativo', 1, 'Primeira tattoo'),
(4, 'Mariana Red Soul', '+55 41 98765-7011', '@mariana_redsoul', 'mariana@email.com', 'Neo Traditional', 'Coração vermelho', '2024-08-15', NULL, 'Inativo', 1, 'Sumiu'),
(4, 'Pedro Crimson Lab', '+55 41 98765-7012', '@pedro_crimsonlab', 'pedro@email.com', 'Realismo', 'Retrato', '2024-11-20', '2025-02-20', 'Fidelizado', 5, 'Quer coleção de retratos'),
(4, 'Renata Blood Art', '+55 41 98765-7013', '@renata_bloodart', 'renata@email.com', 'Aquarela', 'Splatter', '2024-11-10', NULL, 'Ativo', 2, 'Estilo único'),
(4, 'Sofia Lab Experiment', '+55 41 98765-7014', '@sofia_experiment', 'sofia@email.com', 'Minimalista', 'Linha única', '2024-11-28', NULL, 'Ativo', 1, 'Quer algo simples'),
(4, 'Thiago Red Warrior', '+55 41 98765-7015', '@thiago_redwarrior', 'thiago@email.com', 'Maori', 'Tribal vermelho', '2024-11-01', '2025-01-15', 'Agendado', 3, 'Guerreiro moderno');

-- Studio 5: Void Walker Studio (Premium)
INSERT INTO clients (studio_id, nome, telefone, instagram, email, estilo_favorito, servico_principal, ultimo_atendimento, proximo_retorno, status, total_tatuagens, observacoes) VALUES
(5, 'Alexandre Void', '+55 61 98765-8001', '@alexandre_void', 'alexandre@email.com', 'Blackwork', 'Vazio absoluto', '2024-11-15', '2025-01-15', 'Fidelizado', 7, 'Projeto filosófico'),
(5, 'Bárbara Shadow Walk', '+55 61 98765-8002', '@barbara_shadowwalk', 'barbara@email.com', 'Fineline', 'Sombras', '2024-11-10', NULL, 'Ativo', 3, 'Ama mistério'),
(5, 'César Dark Void', '+55 61 98765-8003', '@cesar_darkvoid', 'cesar@email.com', 'Abstrato', 'Abismo', '2024-10-25', NULL, 'Ativo', 4, 'Arte conceitual'),
(5, 'Diana Eternal Night', '+55 61 98765-8004', '@diana_eternalnight', 'diana@email.com', 'Neo Traditional', 'Noite eterna', '2024-11-20', '2024-12-20', 'Agendado', 2, 'Temática noturna'),
(5, 'Eduardo Shadow Realm', '+55 61 98765-8005', '@eduardo_shadowrealm', 'eduardo@email.com', 'Horror', 'Reino das sombras', '2024-09-10', NULL, 'Inativo', 3, 'Cliente antigo'),
(5, 'Fabiana Void Queen', '+55 61 98765-8006', '@fabiana_voidqueen', 'fabiana@email.com', 'Blackwork', 'Rainha do vazio', '2024-11-18', '2025-02-18', 'Fidelizado', 6, 'VIP - projeto grande'),
(5, 'Gustavo Dark Path', '+55 61 98765-8007', '@gustavo_darkpath', 'gustavo@email.com', 'Tribal', 'Caminho sombrio', '2024-11-15', NULL, 'Ativo', 4, 'Estilo místico'),
(5, 'Helena Void Witch', '+55 61 98765-8008', '@helena_voidwitch', 'helena@email.com', 'Neo Traditional', 'Bruxa do vazio', '2024-11-22', '2024-12-22', 'Agendado', 3, 'Temática de bruxaria'),
(5, 'Igor Shadow Beast', '+55 61 98765-8009', '@igor_shadowbeast', 'igor@email.com', 'Realismo', 'Fera sombria', '2024-11-08', '2025-01-08', 'Ativo', 5, 'Animais mitológicos'),
(5, 'Juliana Void Soul', '+55 61 98765-8010', '@juliana_voidsoul', 'juliana@email.com', 'Fineline', 'Alma vazia', '2024-11-25', NULL, 'Ativo', 2, 'Filosofia existencial'),
(5, 'Kevin Dark Matter', '+55 61 98765-8011', '@kevin_darkmatter', 'kevin@email.com', 'Geométrico', 'Matéria escura', '2024-07-20', NULL, 'Inativo', 2, 'Físico teórico'),
(5, 'Laura Shadow Dancer', '+55 61 98765-8012', '@laura_shadowdancer', 'laura@email.com', 'Aquarela', 'Dança sombria', '2024-11-20', '2024-12-28', 'Fidelizado', 6, 'Bailarina profissional'),
(5, 'Marcelo Void Walker', '+55 61 98765-8013', '@marcelo_voidwalker', 'marcelo@email.com', 'Blackwork', 'Andarilho do vazio', '2024-11-10', '2025-02-10', 'Ativo', 4, 'Projeto de corpo todo'),
(5, 'Natália Eternal Shadow', '+55 61 98765-8014', '@natalia_eternalshadow', 'natalia@email.com', 'Neo Traditional', 'Sombra eterna', '2024-11-28', NULL, 'Ativo', 3, 'Gótica clássica'),
(5, 'Otávio Abyss Walker', '+55 61 98765-8015', '@otavio_abysswalker', 'otavio@email.com', 'Horror', 'Abismo profundo', '2024-11-05', '2025-01-15', 'Fidelizado', 7, 'Dark Souls fan'),
(5, 'Paula Void Empress', '+55 61 98765-8016', '@paula_voidempress', 'paula@email.com', 'Ornamental', 'Imperatriz vazia', '2024-11-23', '2025-03-23', 'Agendado', 5, 'Projeto de braço completo'),
(5, 'Roberto Shadow King', '+55 61 98765-8017', '@roberto_shadowking', 'roberto@email.com', 'Realismo', 'Rei das sombras', '2024-11-01', '2025-02-01', 'Fidelizado', 8, 'Coleção épica'),
(5, 'Sabrina Dark Mage', '+55 61 98765-8018', '@sabrina_darkmage', 'sabrina@email.com', 'Fineline', 'Maga sombria', '2024-11-12', NULL, 'Ativo', 2, 'RPG player');

-- ============================================================================
-- SEED DATA: Sessions (10-15 por estúdio)
-- ============================================================================

-- Sessions para Studio 1: Skull King Ink
INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) VALUES
(1, 1, 1, '2024-10-15', 'continuidade', 4.0, 1200.00, 'realizada', 'Continuação costas - caveiras'),
(1, 2, 2, '2024-11-01', 'primeira', 3.5, 950.00, 'realizada', 'Início braço fechado com rosas'),
(1, 3, 1, '2024-11-10', 'continuidade', 5.0, 1500.00, 'realizada', 'Perna - trabalho trash polka'),
(1, 6, 1, '2024-11-15', 'continuidade', 6.0, 1800.00, 'realizada', 'Costas completas - sessão 5'),
(1, 8, 2, '2024-10-30', 'primeira', 3.0, 850.00, 'realizada', 'Costela - fênix aquarela'),
(1, 9, 1, '2024-11-20', 'primeira', 4.0, 1100.00, 'realizada', 'Peito - lobo realista'),
(1, 10, 2, '2024-11-12', 'continuidade', 4.5, 1250.00, 'realizada', 'Braço mandala - finalização'),
(1, 12, 1, '2024-11-22', 'primeira', 3.5, 900.00, 'realizada', 'Coxa - caveiras mexicanas'),
(1, 13, 2, '2024-11-05', 'continuidade', 5.0, 1450.00, 'realizada', 'Sleeve - sessão 4'),
(1, 14, 1, '2024-11-25', 'primeira', 2.5, 700.00, 'realizada', 'Costela - primeira tattoo delicada'),
(1, 2, 2, '2024-12-01', 'continuidade', 4.0, 1100.00, 'agendada', 'Continuação braço fechado'),
(1, 8, 2, '2024-12-20', 'continuidade', 3.5, 950.00, 'agendada', 'Adicionar detalhes na fênix'),
(1, 16, 1, '2024-11-28', 'primeira', 3.0, 850.00, 'realizada', 'Panturrilha - felino realista');

-- Sessions para Studio 2: Black Rose Atelier
INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) VALUES
(2, 21, 3, '2024-11-15', 'continuidade', 3.5, 950.00, 'realizada', 'Rosas vermelhas - finalização'),
(2, 22, 4, '2024-11-10', 'primeira', 2.5, 700.00, 'realizada', 'Flores delicadas fineline'),
(2, 23, 3, '2024-10-20', 'primeira', 4.0, 1100.00, 'realizada', 'Caveira com flores - blackwork'),
(2, 26, 3, '2024-11-18', 'continuidade', 4.5, 1250.00, 'realizada', 'Mandala floral - braço'),
(2, 27, 4, '2024-11-12', 'primeira', 3.0, 850.00, 'realizada', 'Rosa e relógio vitoriano'),
(2, 29, 3, '2024-11-05', 'primeira', 4.0, 1100.00, 'realizada', 'Flores mortas - blackwork'),
(2, 30, 4, '2024-11-25', 'primeira', 2.0, 600.00, 'realizada', 'Plantas nativas - braço'),
(2, 32, 3, '2024-11-20', 'continuidade', 5.0, 1400.00, 'realizada', 'Braço de rosas - sessão 3'),
(2, 33, 4, '2024-11-10', 'primeira', 4.0, 1150.00, 'realizada', 'Jardim secreto - costas início'),
(2, 35, 3, '2024-11-01', 'continuidade', 3.5, 950.00, 'realizada', 'Caveira e rosas - finalização'),
(2, 24, 3, '2024-12-15', 'primeira', 3.0, 850.00, 'agendada', 'Flores aquarela - primeira sessão'),
(2, 28, 4, '2024-12-22', 'continuidade', 3.5, 950.00, 'agendada', 'Bouquet delicado - adicionar cor');

-- Sessions para Studio 3: Night Owl Tattoo
INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) VALUES
(3, 37, 5, '2024-11-16', 'continuidade', 4.0, 1150.00, 'realizada', 'Coruja realista - detalhes'),
(3, 38, 5, '2024-11-12', 'primeira', 2.5, 700.00, 'realizada', 'Lua e estrelas fineline'),
(3, 39, 5, '2024-10-25', 'primeira', 5.0, 1400.00, 'realizada', 'Asas de coruja - costas início'),
(3, 42, 5, '2024-11-18', 'continuidade', 4.5, 1250.00, 'realizada', 'Perna aquarela - céu noturno'),
(3, 43, 5, '2024-11-15', 'primeira', 3.0, 850.00, 'realizada', 'Eclipse lunar geométrico'),
(3, 45, 5, '2024-11-08', 'primeira', 4.0, 1100.00, 'realizada', 'Noite sombria blackwork'),
(3, 46, 5, '2024-11-25', 'primeira', 2.0, 600.00, 'realizada', 'Primeira tattoo - estrelas'),
(3, 48, 5, '2024-11-20', 'continuidade', 5.0, 1450.00, 'realizada', 'Coleção mística - bruxa'),
(3, 49, 5, '2024-11-10', 'primeira', 4.0, 1100.00, 'realizada', 'Coruja sombria gótica'),
(3, 51, 5, '2024-11-05', 'continuidade', 4.5, 1300.00, 'realizada', 'Corvo negro - Edgar Allan Poe'),
(3, 40, 5, '2024-12-20', 'primeira', 3.0, 850.00, 'agendada', 'Constelações - pontilhismo'),
(3, 44, 5, '2024-12-22', 'continuidade', 3.5, 950.00, 'agendada', 'Coruja tribal - adicionar cor');

-- Sessions para Studio 4: Crimson Lab
INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) VALUES
(4, 53, 6, '2024-11-10', 'primeira', 2.0, 500.00, 'realizada', 'Arte abstrata experimental'),
(4, 54, 6, '2024-11-15', 'primeira', 2.5, 600.00, 'realizada', 'Símbolos minimalistas'),
(4, 55, 6, '2024-10-20', 'primeira', 3.0, 700.00, 'realizada', 'Manchas aquarela vermelhas'),
(4, 56, 6, '2024-11-18', 'primeira', 3.5, 800.00, 'realizada', 'Formas geométricas arquitetônicas'),
(4, 58, 6, '2024-11-20', 'continuidade', 4.0, 950.00, 'realizada', 'Blackwork tinta vermelha'),
(4, 59, 6, '2024-11-12', 'primeira', 2.5, 600.00, 'realizada', 'Rosa crimson fineline'),
(4, 61, 6, '2024-11-05', 'primeira', 3.0, 700.00, 'realizada', 'Experimento abstrato único'),
(4, 62, 6, '2024-11-10', 'primeira', 2.0, 500.00, 'realizada', 'Primeira tattoo - linha única'),
(4, 64, 6, '2024-11-20', 'continuidade', 4.5, 1100.00, 'realizada', 'Coleção de retratos - sessão 2'),
(4, 54, 6, '2024-12-15', 'continuidade', 3.0, 700.00, 'agendada', 'Adicionar símbolos'),
(4, 60, 6, '2024-12-22', 'primeira', 2.5, 650.00, 'agendada', 'Lua sangrenta horror');

-- Sessions para Studio 5: Void Walker Studio
INSERT INTO sessions (studio_id, client_id, artist_id, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho) VALUES
(5, 69, 7, '2024-11-15', 'continuidade', 5.0, 1500.00, 'realizada', 'Projeto filosófico - vazio absoluto'),
(5, 70, 8, '2024-11-10', 'primeira', 3.0, 850.00, 'realizada', 'Sombras fineline'),
(5, 71, 7, '2024-10-25', 'primeira', 4.5, 1250.00, 'realizada', 'Abismo abstrato conceitual'),
(5, 74, 7, '2024-11-18', 'continuidade', 6.0, 1800.00, 'realizada', 'VIP - rainha do vazio sessão 4'),
(5, 75, 8, '2024-11-15', 'primeira', 4.0, 1100.00, 'realizada', 'Caminho sombrio tribal'),
(5, 77, 7, '2024-11-08', 'continuidade', 5.0, 1450.00, 'realizada', 'Fera sombria - animais mitológicos'),
(5, 78, 8, '2024-11-25', 'primeira', 2.5, 700.00, 'realizada', 'Alma vazia - filosofia'),
(5, 80, 7, '2024-11-20', 'continuidade', 5.5, 1600.00, 'realizada', 'Bailarina - dança sombria'),
(5, 81, 8, '2024-11-10', 'continuidade', 6.0, 1750.00, 'realizada', 'Corpo todo - andarilho do vazio'),
(5, 83, 7, '2024-11-05', 'continuidade', 5.0, 1500.00, 'realizada', 'Dark Souls - abismo profundo'),
(5, 85, 8, '2024-11-01', 'continuidade', 6.5, 1900.00, 'realizada', 'Coleção épica - rei das sombras'),
(5, 72, 7, '2024-12-20', 'continuidade', 4.0, 1150.00, 'agendada', 'Noite eterna - adicionar lua'),
(5, 76, 8, '2024-12-22', 'primeira', 3.5, 950.00, 'agendada', 'Bruxa do vazio - primeira sessão'),
(5, 84, 7, '2025-03-23', 'continuidade', 5.0, 1450.00, 'agendada', 'Imperatriz vazia - braço sessão 3');

-- ============================================================================
-- FIM DO SCHEMA E SEEDS
-- ============================================================================

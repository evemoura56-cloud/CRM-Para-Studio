# INKHOUSE CRM - API REST
Base URL local: `http://localhost:4000`

## Autenticacao
- `POST /auth/login`  
  Body: `{ "email": "...", "senha": "...", "studio_slug": "skullking" }` (studio_slug opcional para admin).  
  Retorna: `token` (JWT), `user`, `studio`, `subscription`.
- `POST /auth/register-studio`  
  Body: `nome_estudio`, `slug_subdominio`, `email_contato`, `telefone`, `endereco`, `owner_email`, `owner_senha`, `owner_nome`.  
  Retorna estudio + owner + assinatura trial (7 dias) + token.

## Clientes
JWT obrigatorio.  
- `GET /clients?status=agendado&search=ink` -> lista clientes do estudio logado com filtros.  
- `POST /clients` cria cliente (plano free limitado a 15). Campos: nome, telefone, instagram, email, estilo_favorito, servico_principal, proximo_retorno, status, observacoes.  
- `PUT /clients/:id` atualiza cliente e revalida status (fidelizado >=4 sessoes, inativo >180 dias sem sessao).

## Sessoes
- `GET /sessions` lista sessoes do estudio.  
- `POST /sessions` cria sessao `{ client_id, artist_id?, data_sessao, tipo_sessao, duracao_horas, valor_cobrado, status, descricao_trabalho }`; atualiza `ultimo_atendimento`, `proximo_retorno` e `total_tatuagens` conforme regras.

## Dashboard
- `GET /dashboard` -> `{ totalClientes, fidelizados, agendados, mediaTattoos, receitaTotal }`.

## Settings (neon e lembretes)
- `GET /settings` -> configuracoes do estudio.  
- `PUT /settings` -> atualiza `{ cor_neon, brilho_neon, efeito_piscar_neon, lembretes_whatsapp_ativos, dias_antecedencia_lembrete }`.

## Assinaturas / Planos
- `GET /subscriptions` -> assinatura atual.  
- `POST /subscriptions/upgrade` -> `{ plano, metodo_pagamento }` (free/pro/premium).  
- `POST /subscriptions/callback` -> simula webhook: `{ studio_slug, status }`.

## Admin Master
- `GET /admin/studios` -> lista geral de estudios, usuarios, clientes e assinaturas (role `admin_master`).  
- `GET /admin/activity-logs` -> registros de atividade basicos.

## Regras de negocio implementadas
- Limite de clientes no plano Free (15).  
- Cliente com >=4 sessoes realizadas torna-se `fidelizado`.  
- Cliente sem sessao por >6 meses torna-se `inativo` (checado ao atualizar/registrar sessao).  
- Totais e media de tattoos calculados no dashboard.  
- Plano controla acesso mobile/export (placeholders nos limites).  

## Erros padronizados
Retorno `400` para payload invalido, `401` para autenticacao, `403` para permissoes/plano, `404` quando recurso nao existe. Payload: `{ "error": "mensagem" }`.

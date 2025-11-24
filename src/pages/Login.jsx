import React, { useState } from 'react';
import SkullLogo from '../components/SkullLogo';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login simples para demo
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Efeito de fundo com linhas neon */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-red to-transparent"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-red to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-red to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <SkullLogo className="w-32 h-32" animate={true} />
          </div>
          
          <h1 className="text-5xl font-poppins mb-2" style={{
            color: '#FF0000',
            textShadow: '0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.3)'
          }}>
            INKHOUSE CRM
          </h1>
          
          <p className="text-ice-gray font-inter text-lg italic">
            "Tatuagens contam histórias. O CRM guarda todas elas."
          </p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-neon">
            <div className="space-y-4">
              <div>
                <label className="block text-ice-gray font-inter mb-2 text-sm">
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-neon w-full"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>

              <div>
                <label className="block text-ice-gray font-inter mb-2 text-sm">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-neon w-full"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="neon-button w-full text-lg py-3"
          >
            ENTRAR NO SISTEMA
          </button>
        </form>

        {/* Info adicional */}
        <div className="mt-8 text-center">
          <p className="text-xs text-charcoal-gray font-inter">
            Sistema de gerenciamento para estúdios de tatuagem
          </p>
        </div>
      </div>

      {/* Glow effect nos cantos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-neon-red opacity-5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-red opacity-5 blur-3xl rounded-full"></div>
    </div>
  );
};

export default Login;

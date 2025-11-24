import React from 'react';
import { mockClients } from '../data/mockData';
import Header from '../components/Header';
import { Star, Crown, Phone, Mail, TrendingUp } from 'lucide-react';
import SkullLogo from '../components/SkullLogo';

const VIP = () => {
  const vipClients = mockClients.filter(client => client.vip);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="💀 Clientes VIP" 
        subtitle="Clientes premium com tratamento especial"
      />

      <div className="flex-1 overflow-auto p-8">
        {/* Banner VIP */}
        <div className="card-neon mb-8 text-center py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <SkullLogo className="w-16 h-16" animate={true} />
            </div>
            <h2 className="text-3xl font-poppins text-neon-red neon-text mb-2">
              ZONA VIP EXCLUSIVA
            </h2>
            <p className="text-ice-gray font-inter">
              Clientes premium com histórico excepcional e tratamento diferenciado
            </p>
          </div>
        </div>

        {/* Estatísticas VIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-neon text-center">
            <Crown className="w-8 h-8 text-neon-red mx-auto mb-2" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {vipClients.length}
            </div>
            <div className="text-ice-gray font-inter text-sm">
              Clientes VIP
            </div>
          </div>

          <div className="card-neon text-center">
            <Star className="w-8 h-8 text-neon-red mx-auto mb-2 fill-neon-red" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {vipClients.reduce((acc, client) => acc + client.totalTattoos, 0)}
            </div>
            <div className="text-ice-gray font-inter text-sm">
              Total Tattoos
            </div>
          </div>

          <div className="card-neon text-center">
            <TrendingUp className="w-8 h-8 text-neon-red mx-auto mb-2" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {Math.round(vipClients.reduce((acc, client) => acc + client.totalTattoos, 0) / vipClients.length)}
            </div>
            <div className="text-ice-gray font-inter text-sm">
              Média/Cliente
            </div>
          </div>

          <div className="card-neon text-center">
            <Crown className="w-8 h-8 text-neon-red mx-auto mb-2" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {Math.round((vipClients.length / mockClients.length) * 100)}%
            </div>
            <div className="text-ice-gray font-inter text-sm">
              do Total
            </div>
          </div>
        </div>

        {/* Lista de clientes VIP */}
        <div className="space-y-4">
          {vipClients
            .sort((a, b) => b.totalTattoos - a.totalTattoos)
            .map((client, index) => (
              <div 
                key={client.id} 
                className="card-neon relative overflow-hidden"
                style={{
                  boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
                }}
              >
                {/* Ranking badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-neon-red text-dark-bg w-10 h-10 rounded-full flex items-center justify-center font-poppins font-bold text-lg shadow-neon-red-strong">
                      #{index + 1}
                    </div>
                  </div>
                )}

                {/* Efeito de fundo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-red opacity-5 blur-3xl rounded-full"></div>

                <div className="relative z-10 flex items-start gap-6">
                  {/* Espaço para ranking */}
                  <div className="w-10"></div>

                  {/* Conteúdo principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-ice-gray font-poppins text-2xl mb-1 flex items-center gap-2">
                          {client.name}
                          <Crown className="w-5 h-5 text-neon-red animate-pulse" />
                        </h3>
                        <p className="text-neon-red font-inter text-lg">
                          {client.style}
                        </p>
                      </div>
                      <Star className="w-8 h-8 text-neon-red fill-neon-red animate-pulse-neon" />
                    </div>

                    {/* Contatos */}
                    <div className="flex gap-6 mb-4">
                      <div className="flex items-center gap-2 text-ice-gray">
                        <Phone className="w-4 h-4" />
                        <span className="font-inter">{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ice-gray">
                        <Mail className="w-4 h-4" />
                        <span className="font-inter">{client.email}</span>
                      </div>
                    </div>

                    {/* Observações */}
                    <p className="text-ice-gray font-inter leading-relaxed mb-4">
                      {client.observations}
                    </p>

                    {/* Métricas */}
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-neon-red">
                      <div>
                        <div className="text-neon-red font-poppins text-3xl mb-1 neon-text">
                          {client.totalTattoos}
                        </div>
                        <div className="text-ice-gray font-inter text-sm">
                          Tatuagens
                        </div>
                      </div>
                      <div>
                        <div className="text-ice-gray font-inter text-lg mb-1">
                          {client.lastVisit}
                        </div>
                        <div className="text-ice-gray font-inter text-sm">
                          Última Visita
                        </div>
                      </div>
                      <div>
                        <div className="text-ice-gray font-inter text-lg mb-1">
                          {client.nextAppointment || 'Não agendado'}
                        </div>
                        <div className="text-ice-gray font-inter text-sm">
                          Próximo
                        </div>
                      </div>
                      <div>
                        <div className={`font-inter text-lg mb-1 ${
                          client.status === 'fidelizado' ? 'text-neon-red neon-text' : 'text-ice-gray'
                        }`}>
                          {client.status === 'fidelizado' ? '❤️ Fidelizado' : 
                           client.status === 'ativo' ? '✓ Ativo' :
                           client.status === 'agendado' ? '📅 Agendado' : '⏸ Inativo'}
                        </div>
                        <div className="text-ice-gray font-inter text-sm">
                          Status
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {vipClients.length === 0 && (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-charcoal-gray mx-auto mb-4" />
            <p className="text-ice-gray font-inter text-lg">
              Nenhum cliente VIP cadastrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIP;

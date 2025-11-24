import React, { useMemo } from 'react';
import { mockClients } from '../data/mockData';
import Header from '../components/Header';
import { Star, Crown, Phone, Mail, TrendingUp } from 'lucide-react';
import SkullLogo from '../components/SkullLogo';

const VIP = ({ clients = mockClients }) => {
  const vipClients = useMemo(
    () => (clients || []).filter((client) => client.vip || (client.totalTattoos || 0) >= 10),
    [clients]
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="Clientes VIP" 
        subtitle="Clientes premium com tratamento especial"
      />

      <div className="flex-1 overflow-auto p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-neon text-center">
            <Crown className="w-8 h-8 text-neon-red mx-auto mb-2" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {vipClients.length}
            </div>
            <div className="text-ice-gray font-inter text-sm">
              VIP ativos
            </div>
          </div>

          <div className="card-neon text-center">
            <TrendingUp className="w-8 h-8 text-neon-red mx-auto mb-2" />
            <div className="text-neon-red text-3xl font-poppins mb-1 neon-text">
              {vipClients.reduce((acc, c) => acc + (c.totalTattoos || 0), 0)}
            </div>
            <div className="text-ice-gray font-inter text-sm">
              Tattoos realizadas
            </div>
          </div>

          <div className="card-neon text-center col-span-1 md:col-span-2">
            <div className="flex items-center justify-center gap-3 text-neon-red font-poppins text-xl neon-text">
              <Star className="w-6 h-6" />
              Ranking de fidelidade
            </div>
            <p className="text-ice-gray font-inter text-sm mt-2">
              Baseado no número de sessões e status VIP.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vipClients
            .sort((a, b) => (b.totalTattoos || 0) - (a.totalTattoos || 0))
            .map((client, index) => (
            <div key={client.id} className="card-neon relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-neon-red text-dark-bg px-3 py-1 rounded-bl-lg font-poppins">
                #{index + 1}
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="bg-dark-bg p-2 rounded-full border border-neon-red">
                  <Crown className="w-6 h-6 text-neon-red" />
                </div>
                <div className="flex-1">
                  <h3 className="text-ice-gray font-poppins text-lg">
                    {client.name}
                  </h3>
                  <p className="text-neon-red font-inter text-sm">
                    {client.style}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-ice-gray text-sm mb-2">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-ice-gray text-sm mb-2">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-ice-gray font-inter text-sm">
                  Total: {client.totalTattoos} tattoos
                </span>
                <div className="flex items-center gap-2 text-neon-red font-poppins">
                  <Star className="w-4 h-4" />
                  VIP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VIP;

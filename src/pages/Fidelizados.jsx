import React from 'react';
import { mockClients } from '../data/mockData';
import Header from '../components/Header';
import { Star, Phone, Mail, Award } from 'lucide-react';

const Fidelizados = () => {
  const fidelizadosClients = mockClients.filter(client => client.status === 'fidelizado');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="❤️ Clientes Fidelizados" 
        subtitle="Clientes leais que retornam constantemente ao estúdio"
      />

      <div className="flex-1 overflow-auto p-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {fidelizadosClients.length}
            </div>
            <div className="text-ice-gray font-inter">
              Clientes Fidelizados
            </div>
          </div>

          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {fidelizadosClients.reduce((acc, client) => acc + client.totalTattoos, 0)}
            </div>
            <div className="text-ice-gray font-inter">
              Total de Tatuagens
            </div>
          </div>

          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {Math.round(fidelizadosClients.reduce((acc, client) => acc + client.totalTattoos, 0) / fidelizadosClients.length)}
            </div>
            <div className="text-ice-gray font-inter">
              Média por Cliente
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fidelizadosClients
            .sort((a, b) => b.totalTattoos - a.totalTattoos)
            .map(client => (
              <div key={client.id} className="card-neon relative overflow-hidden">
                {/* Efeito de fundo vermelho suave */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-red opacity-5 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                  {/* Header com VIP badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-ice-gray font-poppins text-xl mb-1">
                        {client.name}
                      </h3>
                      <p className="text-neon-red font-inter">
                        {client.style}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Award className="w-6 h-6 text-neon-red animate-pulse-neon" />
                      {client.vip && (
                        <Star className="w-6 h-6 text-neon-red fill-neon-red animate-pulse-neon" />
                      )}
                    </div>
                  </div>

                  {/* Contatos */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-ice-gray text-sm">
                      <Phone className="w-4 h-4" />
                      <span className="font-inter">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ice-gray text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="font-inter">{client.email}</span>
                    </div>
                  </div>

                  {/* Observações */}
                  <p className="text-ice-gray font-inter text-sm leading-relaxed mb-4">
                    {client.observations}
                  </p>

                  {/* Estatísticas do cliente */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-charcoal-gray">
                    <div className="text-center">
                      <div className="text-neon-red font-poppins text-2xl">
                        {client.totalTattoos}
                      </div>
                      <div className="text-ice-gray font-inter text-xs">
                        Tattoos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-ice-gray font-inter text-sm">
                        {client.lastVisit}
                      </div>
                      <div className="text-ice-gray font-inter text-xs">
                        Última visita
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-ice-gray font-inter text-sm">
                        {client.nextAppointment || 'N/A'}
                      </div>
                      <div className="text-ice-gray font-inter text-xs">
                        Próxima
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {fidelizadosClients.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-charcoal-gray mx-auto mb-4" />
            <p className="text-ice-gray font-inter text-lg">
              Nenhum cliente fidelizado ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fidelizados;

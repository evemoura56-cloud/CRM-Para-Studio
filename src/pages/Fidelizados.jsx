import React, { useMemo } from 'react';
import { mockClients } from '../data/mockData';
import Header from '../components/Header';
import { Star, Phone, Mail, Award } from 'lucide-react';

const Fidelizados = ({ clients = mockClients, dashboard }) => {
  const fidelizadosClients = useMemo(
    () => (clients || []).filter((client) => client.status === 'fidelizado'),
    [clients]
  );

  const totalTattoos = fidelizadosClients.reduce(
    (acc, client) => acc + (client.totalTattoos || 0),
    0
  );
  const media =
    fidelizadosClients.length > 0
      ? Math.round(totalTattoos / fidelizadosClients.length)
      : 0;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="Clientes Fidelizados" 
        subtitle="Clientes leais que retornam constantemente ao estúdio"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {dashboard?.fidelizados ?? fidelizadosClients.length}
            </div>
            <div className="text-ice-gray font-inter">
              Clientes Fidelizados
            </div>
          </div>

          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {totalTattoos}
            </div>
            <div className="text-ice-gray font-inter">
              Total de Tatuagens
            </div>
          </div>

          <div className="card-neon text-center">
            <div className="text-neon-red text-4xl font-poppins mb-2 neon-text">
              {media}
            </div>
            <div className="text-ice-gray font-inter">
              Média por Cliente
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fidelizadosClients.map((client) => (
            <div key={client.id} className="card-neon relative">
              <div className="absolute top-3 right-3 text-neon-red">
                <Award className="w-5 h-5" />
              </div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-ice-gray font-poppins text-xl mb-1">
                    {client.name}
                  </h3>
                  <p className="text-neon-red font-inter text-sm">
                    {client.style}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-neon-red text-dark-bg px-3 py-1 rounded-full text-sm font-poppins">
                  <Star className="w-4 h-4" />
                  {client.totalTattoos} tattoos
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-ice-gray text-sm">
                  <Phone className="w-4 h-4" />
                  <span className="font-inter">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-ice-gray text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="font-inter">{client.email}</span>
                </div>
              </div>

              <p className="text-ice-gray font-inter text-sm leading-relaxed">
                {client.observations}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fidelizados;

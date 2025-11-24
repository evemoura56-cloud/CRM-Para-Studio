import React from 'react';
import { mockClients } from '../data/mockData';
import Header from '../components/Header';
import { Calendar, Phone, Mail } from 'lucide-react';

const Retornos = () => {
  // Filtrar clientes com próximo agendamento
  const clientsWithAppointments = mockClients
    .filter(client => client.nextAppointment)
    .sort((a, b) => new Date(a.nextAppointment) - new Date(b.nextAppointment));

  const getDaysUntil = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days < 0) return 'text-charcoal-gray'; // Passou
    if (days <= 3) return 'text-neon-red neon-text'; // Urgente
    if (days <= 7) return 'text-neon-red'; // Próximo
    return 'text-ice-gray'; // Normal
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="Retornos Agendados" 
        subtitle="Próximos agendamentos e retornos dos clientes"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="space-y-4">
          {clientsWithAppointments.map(client => {
            const daysUntil = getDaysUntil(client.nextAppointment);
            const urgencyColor = getUrgencyColor(daysUntil);
            
            return (
              <div key={client.id} className="card-neon">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Nome e estilo */}
                    <div className="mb-3">
                      <h3 className="text-ice-gray font-poppins text-xl mb-1">
                        {client.name}
                      </h3>
                      <p className="text-neon-red font-inter text-sm">
                        {client.style}
                      </p>
                    </div>

                    {/* Contatos */}
                    <div className="flex gap-6 mb-3">
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
                    <p className="text-ice-gray font-inter text-sm leading-relaxed">
                      {client.observations}
                    </p>
                  </div>

                  {/* Data e contador */}
                  <div className="ml-6 text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-5 h-5 ${urgencyColor}`} />
                      <span className={`font-poppins text-lg ${urgencyColor}`}>
                        {client.nextAppointment}
                      </span>
                    </div>
                    <p className={`font-inter text-sm ${urgencyColor}`}>
                      {daysUntil < 0 
                        ? `Passou ${Math.abs(daysUntil)} dias`
                        : daysUntil === 0
                        ? 'HOJE'
                        : daysUntil === 1
                        ? 'AMANHÃ'
                        : `Em ${daysUntil} dias`
                      }
                    </p>
                    {daysUntil <= 3 && daysUntil >= 0 && (
                      <p className="text-neon-red font-inter text-xs mt-1 animate-pulse">
                        ⚠️ URGENTE
                      </p>
                    )}
                  </div>
                </div>

                {/* Histórico */}
                <div className="mt-4 pt-4 border-t border-charcoal-gray flex justify-between items-center">
                  <span className="text-ice-gray font-inter text-sm">
                    Última visita: {client.lastVisit}
                  </span>
                  <span className="text-ice-gray font-inter text-sm">
                    Total: {client.totalTattoos} tatuagens
                  </span>
                </div>
              </div>
            );
          })}

          {clientsWithAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-charcoal-gray mx-auto mb-4" />
              <p className="text-ice-gray font-inter text-lg">
                Nenhum retorno agendado no momento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Retornos;

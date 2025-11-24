import React, { useMemo, useState } from 'react';
import { Search, Phone, Mail, Calendar, Star } from 'lucide-react';
import { mockClients, statusColors } from '../data/mockData';
import Header from '../components/Header';

const Clientes = ({ clients = mockClients, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = useMemo(() => {
    return (clients || []).filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterStatus]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="Clientes" 
        subtitle="Gerencie todos os clientes do estúdio"
      />

      <div className="flex-1 overflow-auto p-8">
        {loading && (
          <div className="mb-4 text-ice-gray font-inter">Sincronizando clientes...</div>
        )}
        {/* Filtros e busca */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou estilo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-neon w-full pl-12"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded font-inter text-sm transition-all duration-300 ${
                filterStatus === 'all'
                  ? 'bg-neon-red text-dark-bg shadow-neon-red'
                  : 'bg-charcoal-gray text-ice-gray hover:bg-dark-bg'
              }`}
            >
              Todos
            </button>
            {Object.keys(statusColors).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded font-inter text-sm transition-all duration-300 ${
                  filterStatus === status
                    ? 'bg-neon-red text-dark-bg shadow-neon-red'
                    : 'bg-charcoal-gray text-ice-gray hover:bg-dark-bg'
                }`}
              >
                {statusColors[status].icon} {statusColors[status].text}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="card-neon cursor-pointer relative"
            >
              {/* Badge VIP */}
              {client.vip && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-neon-red fill-neon-red animate-pulse-neon" />
                </div>
              )}

              {/* Nome e estilo */}
              <h3 className="text-ice-gray font-poppins text-lg mb-2 pr-6">
                {client.name}
              </h3>
              <p className="text-neon-red font-inter text-sm mb-3">
                {client.style}
              </p>

              {/* Informações de contato */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-ice-gray text-sm">
                  <Phone className="w-4 h-4" />
                  <span className="font-inter">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-ice-gray text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="font-inter truncate">{client.email}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-full text-xs font-inter font-semibold"
                  style={{
                    backgroundColor: statusColors[client.status].bg,
                    color: statusColors[client.status].textColor || '#E6E6E6'
                  }}
                >
                  {statusColors[client.status].text}
                </span>
                <span className="text-ice-gray text-xs font-inter">
                  {client.totalTattoos} tattoos
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ice-gray font-inter text-lg">
              Nenhum cliente encontrado
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalhes do cliente */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="bg-charcoal-gray border-2 border-neon-red rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-poppins text-neon-red mb-2" style={{ 
                  textShadow: '0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4)'
                }}>
                  {selectedClient.name}
                </h2>
                <p className="text-ice-gray font-inter">{selectedClient.style}</p>
              </div>
              {selectedClient.vip && (
                <Star className="w-8 h-8 text-neon-red fill-neon-red animate-pulse-neon" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-ice-gray font-inter text-sm mb-1 block">Contato</label>
                <p className="text-ice-gray font-inter">{selectedClient.phone}</p>
                <p className="text-ice-gray font-inter">{selectedClient.email}</p>
              </div>

              <div>
                <label className="text-ice-gray font-inter text-sm mb-1 block">Status</label>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-inter font-semibold"
                  style={{
                    backgroundColor: statusColors[selectedClient.status].bg,
                    color: statusColors[selectedClient.status].textColor || '#E6E6E6'
                  }}
                >
                  {statusColors[selectedClient.status].text}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-ice-gray font-inter text-sm mb-1 block">Última visita</label>
                  <p className="text-ice-gray font-inter">{selectedClient.lastVisit}</p>
                </div>
                <div>
                  <label className="text-ice-gray font-inter text-sm mb-1 block">Próximo agendamento</label>
                  <p className="text-ice-gray font-inter">
                    {selectedClient.nextAppointment || 'Não agendado'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-ice-gray font-inter text-sm mb-1 block">Total de tatuagens</label>
                <p className="text-neon-red font-poppins text-2xl">{selectedClient.totalTattoos}</p>
              </div>

              <div>
                <label className="text-ice-gray font-inter text-sm mb-1 block">Observações</label>
                <p className="text-ice-gray font-inter leading-relaxed">
                  {selectedClient.observations}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="neon-button w-full mt-6"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;

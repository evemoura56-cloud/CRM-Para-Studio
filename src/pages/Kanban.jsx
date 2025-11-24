import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { mockClients, statusColors } from '../data/mockData';
import Header from '../components/Header';
import { Star, Phone } from 'lucide-react';

const Kanban = ({ clients = mockClients, onStatusChange }) => {
  const [localClients, setLocalClients] = useState(clients);

  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  const columns = {
    agendado: { title: 'Agendado', status: 'agendado', icon: '🟦' },
    ativo: { title: 'Ativo', status: 'ativo', icon: '⚪' },
    fidelizado: { title: 'Fidelizado', status: 'fidelizado', icon: '❤️' },
    inativo: { title: 'Inativo', status: 'inativo', icon: '⬛' }
  };

  const getClientsByStatus = (status) => {
    return localClients.filter(client => client.status === status);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    const clientId = draggableId;

    setLocalClients(prev =>
      prev.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
    if (onStatusChange) {
      onStatusChange(clientId, newStatus);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="Kanban" 
        subtitle="Gerencie o fluxo de clientes visualmente"
      />

      <div className="flex-1 overflow-auto p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {Object.entries(columns).map(([key, column]) => {
              const columnClients = getClientsByStatus(column.status);
              const color = statusColors[column.status];
              
              return (
                <div key={key} className="flex flex-col">
                  {/* Cabeçalho da coluna */}
                  <div
                    className="rounded-t-lg p-4 mb-2"
                    style={{
                      backgroundColor: color.bg,
                      color: color.textColor || '#E6E6E6',
                      boxShadow: column.status === 'fidelizado' ? '0 0 15px rgba(255, 0, 0, 0.5)' : 'none'
                    }}
                  >
                    <h3 className="font-poppins text-lg font-bold flex items-center justify-between">
                      <span>{column.icon} {column.title}</span>
                      <span className="text-sm bg-dark-bg bg-opacity-50 px-2 py-1 rounded">
                        {columnClients.length}
                      </span>
                    </h3>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={column.status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-b-lg p-2 transition-all duration-300 ${
                          snapshot.isDraggingOver
                            ? 'bg-charcoal-gray border-2 border-neon-red'
                            : 'bg-dark-bg border-2 border-charcoal-gray'
                        }`}
                        style={{
                          minHeight: '500px'
                        }}
                      >
                        <div className="space-y-2">
                          {columnClients.map((client, index) => (
                            <Draggable
                              key={client.id}
                              draggableId={String(client.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-charcoal-gray border rounded-lg p-3 transition-all duration-300 cursor-move ${
                                    snapshot.isDragging
                                      ? 'border-neon-red shadow-neon-red-strong rotate-2'
                                      : 'border-charcoal-gray hover:border-neon-red'
                                  }`}
                                >
                                  {/* VIP Badge */}
                                  {client.vip && (
                                    <div className="flex justify-end mb-1">
                                      <Star className="w-4 h-4 text-neon-red fill-neon-red" />
                                    </div>
                                  )}

                                  {/* Nome */}
                                  <h4 className="text-ice-gray font-inter font-semibold text-sm mb-1">
                                    {client.name}
                                  </h4>

                                  {/* Estilo */}
                                  <p className="text-neon-red font-inter text-xs mb-2">
                                    {client.style}
                                  </p>

                                  {/* Telefone */}
                                  <div className="flex items-center gap-1 text-ice-gray text-xs">
                                    <Phone className="w-3 h-3" />
                                    <span className="font-inter">{client.phone}</span>
                                  </div>

                                  {/* Próximo agendamento */}
                                  {client.nextAppointment && (
                                    <div className="mt-2 pt-2 border-t border-charcoal-gray">
                                      <p className="text-ice-gray text-xs font-inter">
                                        Próx: {client.nextAppointment}
                                      </p>
                                    </div>
                                  )}

                                  {/* Total tattoos */}
                                  <div className="mt-2 flex justify-end">
                                    <span className="text-xs text-ice-gray font-inter bg-dark-bg px-2 py-1 rounded">
                                      {client.totalTattoos} tattoos
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Kanban;

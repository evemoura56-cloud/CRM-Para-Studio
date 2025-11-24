import React from 'react';
import { Users, Calendar, LayoutGrid, Star, Skull, Settings } from 'lucide-react';
import SkullLogo from './SkullLogo';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'retornos', label: 'Retornos', icon: Calendar },
    { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { id: 'fidelizados', label: 'Fidelizados', icon: Star },
    { id: 'vip', label: 'VIP', icon: Skull },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-charcoal-gray border-r border-neon-red flex flex-col">
      {/* Logo e título */}
      <div className="p-6 border-b border-neon-red flex items-center gap-4">
        <SkullLogo className="w-12 h-12" animate={true} />
        <div>
          <h1 className="text-neon-red font-poppins text-lg neon-text">INKHOUSE</h1>
          <p className="text-ice-gray text-xs font-inter">Tattoo Studio CRM</p>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-inter
                    ${isActive 
                      ? 'bg-neon-red text-dark-bg shadow-neon-red-strong' 
                      : 'text-ice-gray hover:bg-dark-bg hover:text-neon-red hover:shadow-neon-red'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer com assinatura */}
      <div className="p-4 border-t border-charcoal-gray text-center">
        <p className="text-xs text-ice-gray font-inter">
          Criado por: <span className="text-neon-red font-semibold">Evelyn Moura</span>
        </p>
        <p className="text-xs text-ice-gray font-inter mt-1">
          Automação & Processos
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

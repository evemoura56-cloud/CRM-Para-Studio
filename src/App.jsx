import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Retornos from './pages/Retornos';
import Kanban from './pages/Kanban';
import Fidelizados from './pages/Fidelizados';
import VIP from './pages/VIP';
import Configuracoes from './pages/Configuracoes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('clientes');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'clientes':
        return <Clientes />;
      case 'retornos':
        return <Retornos />;
      case 'kanban':
        return <Kanban />;
      case 'fidelizados':
        return <Fidelizados />;
      case 'vip':
        return <VIP />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Clientes />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;

import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Retornos from './pages/Retornos';
import Kanban from './pages/Kanban';
import Fidelizados from './pages/Fidelizados';
import VIP from './pages/VIP';
import Configuracoes from './pages/Configuracoes';
import { fetchClients, fetchDashboard, fetchSessions, loginRequest, updateClient } from './services/api';
import { mockClients } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('clientes');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [studio, setStudio] = useState(null);
  const [clients, setClients] = useState(mockClients);
  const [sessions, setSessions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeClient = (client) => ({
    id: client.id,
    name: client.nome,
    email: client.email,
    phone: client.telefone,
    style: client.estilo_favorito,
    status: client.status?.toLowerCase() || 'ativo',
    lastVisit: client.ultimo_atendimento,
    nextAppointment: client.proximo_retorno,
    observations: client.observacoes,
    vip: (client.total_tatuagens || 0) >= 8,
    totalTattoos: client.total_tatuagens || 0
  });

  const handleLogin = async ({ email, senha, studioSlug }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginRequest({ email, senha, studio_slug: studioSlug });
      setToken(data.token);
      setUser(data.user);
      setStudio(data.studio);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [apiClients, apiSessions, apiDashboard] = await Promise.all([
        fetchClients(token),
        fetchSessions(token),
        fetchDashboard(token)
      ]);
      setClients(apiClients.map(normalizeClient));
      setSessions(apiSessions);
      setDashboard(apiDashboard);
      setError(null);
    } catch (err) {
      setError('Falha ao sincronizar com API. Exibindo dados mock.');
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleStatusChange = async (clientId, status) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, status } : c))
    );
    if (!token) return;
    try {
      await updateClient(token, clientId, { status });
    } catch (err) {
      setError('Erro ao atualizar status no backend.');
    }
  };

  const renderPage = useMemo(() => {
    switch (currentPage) {
      case 'clientes':
        return (
          <Clientes
            clients={clients}
            loading={loading}
          />
        );
      case 'retornos':
        return <Retornos clients={clients} />;
      case 'kanban':
        return (
          <Kanban
            clients={clients}
            onStatusChange={handleStatusChange}
          />
        );
      case 'fidelizados':
        return <Fidelizados clients={clients} dashboard={dashboard} />;
      case 'vip':
        return <VIP clients={clients} />;
      case 'configuracoes':
        return <Configuracoes studio={studio} dashboard={dashboard} />;
      default:
        return (
          <Clientes
            clients={clients}
            loading={loading}
          />
        );
    }
  }, [currentPage, clients, loading, dashboard, studio]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} loading={loading} error={error} />;
  }

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 relative">
        {error && (
          <div className="absolute top-4 right-4 bg-neon-red text-dark-bg px-3 py-2 rounded shadow-neon-red">
            {error}
          </div>
        )}
        {renderPage}
      </div>
    </div>
  );
}

export default App;

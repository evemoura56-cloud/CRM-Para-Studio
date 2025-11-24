import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Linking, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://localhost:4000';

type Session = {
  id: string;
  client_id: string;
  data_sessao: string;
  status: string;
  descricao_trabalho: string;
};

type Client = {
  id: string;
  nome: string;
  telefone?: string;
  estilo_favorito?: string;
  total_tatuagens?: number;
};

export default function App() {
  const [email, setEmail] = useState('owner@skullking.ink');
  const [senha, setSenha] = useState('inkhouse123');
  const [token, setToken] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const neonShadow = {
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  };

  const fetchData = async (t: string) => {
    setLoading(true);
    try {
      const [sessionsRes, clientsRes] = await Promise.all([
        fetch(`${API_URL}/sessions`, { headers: { Authorization: `Bearer ${t}` } }),
        fetch(`${API_URL}/clients`, { headers: { Authorization: `Bearer ${t}` } })
      ]);
      const sessionsJson = await sessionsRes.json();
      const clientsJson = await clientsRes.json();
      setSessions(sessionsJson.sessions || []);
      setClients(clientsJson.clients || []);
      setError(null);
    } catch (err) {
      setError('Falha ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, studio_slug: 'skullking' })
      });
      const json = await res.json();
      if (json.token) {
        setToken(json.token);
        fetchData(json.token);
      } else {
        setError(json.error || 'Login inválido');
      }
    } catch (err) {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  const renderSession = ({ item }: { item: Session }) => {
    const client = clients.find((c) => c.id === item.client_id);
    return (
      <View style={[styles.card, neonShadow]}>
        <Text style={styles.cardTitle}>{client?.nome || 'Cliente'}</Text>
        <Text style={styles.muted}>{item.descricao_trabalho}</Text>
        <Text style={styles.badge}>{item.status} • {item.data_sessao}</Text>
      </View>
    );
  };

  const renderClient = ({ item }: { item: Client }) => (
    <View style={[styles.card, neonShadow]}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.muted}>{item.estilo_favorito}</Text>
      <Text style={styles.badge}>{item.total_tatuagens || 0} tattoos</Text>
      {item.telefone ? (
        <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/55${item.telefone.replace(/\D/g, '')}`)}>
          <Text style={styles.link}>WhatsApp</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={[styles.title, neonShadow]}>INKHOUSE CRM</Text>
        <Text style={styles.subtitle}>Agenda e clientes na palma da mão (tema neon).</Text>

        {!token && (
          <View style={[styles.card, neonShadow]}>
            <Text style={styles.sectionTitle}>Login</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#777"
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              placeholderTextColor="#777"
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        )}

        {token && (
          <>
            <Text style={styles.sectionTitle}>Agenda de hoje</Text>
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderSession}
              horizontal
              showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.sectionTitle}>Clientes</Text>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              renderItem={renderClient}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050506',
    paddingHorizontal: 18,
    paddingTop: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f5f5f5',
    textAlign: 'center',
    marginTop: 8
  },
  subtitle: {
    color: '#c4c4c4',
    textAlign: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12
  },
  card: {
    backgroundColor: '#202124',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    marginBottom: 12
  },
  cardTitle: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '700'
  },
  muted: { color: '#c4c4c4', marginTop: 4 },
  badge: {
    marginTop: 8,
    color: '#050506',
    backgroundColor: '#ff0000',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '700'
  },
  input: {
    backgroundColor: '#131314',
    color: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ff0000',
    marginTop: 10
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12
  },
  buttonText: {
    color: '#050506',
    fontWeight: '700'
  },
  link: {
    color: '#ff0000',
    marginTop: 8
  },
  error: { color: '#ff6b6b', marginTop: 8 }
});

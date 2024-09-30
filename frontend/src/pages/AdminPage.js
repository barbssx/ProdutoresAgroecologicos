import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getProducers, deleteProducer, addProducer } from '../services/api'; // Importando addProducer

const AdminPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProducer, setNewProducer] = useState({ name: '', email: '', password: '', telefone: '', localizacao: '' });

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        setProducers(data);
      } catch (err) {
        setError('Erro ao carregar produtores.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  const handleDelete = async (producerId) => {
    try {
      await deleteProducer(producerId);
      setProducers(producers.filter(p => p._id !== producerId));
    } catch (err) {
      setError('Erro ao excluir produtor.');
    }
  };

  const handleAddProducer = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const createdProducer = await addProducer(newProducer); // Chama a função para adicionar um novo produtor
      setProducers([...producers, createdProducer]); // Adiciona o novo produtor à lista
      setNewProducer({ name: '', email: '', password: '', telefone: '', localizacao: '' }); // Reseta o formulário
    } catch (err) {
      setError('Erro ao adicionar produtor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to homepage
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Página do Administrador</h1>
      <button onClick={handleLogout}>Sair</button> {/* Logout Button */}

      {/* Formulário para adicionar novo produtor */}
      <h2>Adicionar Produtor</h2>
      <form onSubmit={handleAddProducer}>
        <input
          type="text"
          placeholder="Nome"
          value={newProducer.name}
          onChange={(e) => setNewProducer({ ...newProducer, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newProducer.email}
          onChange={(e) => setNewProducer({ ...newProducer, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={newProducer.password}
          onChange={(e) => setNewProducer({ ...newProducer, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={newProducer.telefone}
          onChange={(e) => setNewProducer({ ...newProducer, telefone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Localização"
          value={newProducer.localizacao}
          onChange={(e) => setNewProducer({ ...newProducer, localizacao: e.target.value })}
          required
        />
        <button type="submit">Adicionar Produtor</button>
      </form>

      {/* Lista de Produtores */}
      <h2>Lista de Produtores</h2>
      {producers.length > 0 ? (
        <ul>
          {producers.map(producer => (
            <li key={producer._id}>
              {producer.name} - {producer.email}
              <button onClick={() => handleDelete(producer._id)}>Excluir</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum produtor cadastrado.</p>
      )}
    </div>
  );
};

export default AdminPage;

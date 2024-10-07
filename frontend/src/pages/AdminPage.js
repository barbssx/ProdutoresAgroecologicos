import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducers, deleteProducer, addProducer } from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProducer, setNewProducer] = useState({
    name: '',
    email: '',
    password: '',
    telefone: '',
    localizacao: ''
  });
  const [addingProducer, setAddingProducer] = useState(false);
  const [showForm, setShowForm] = useState(false); 

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
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este produtor?");
    if (confirmDelete) {
      try {
        await deleteProducer(producerId);
        setProducers(producers.filter(p => p._id !== producerId));
      } catch (err) {
        setError('Erro ao excluir produtor.');
      }
    }
  };

  const handleAddProducer = async (e) => {
    e.preventDefault();
    setAddingProducer(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newProducer.email)) {
      setError('Por favor, insira um e-mail válido.');
      setAddingProducer(false);
      return;
    }

    if (newProducer.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setAddingProducer(false);
      return;
    }

    try {
      const createdProducer = await addProducer(newProducer);
      setProducers([...producers, createdProducer]);
      setNewProducer({ name: '', email: '', password: '', telefone: '', localizacao: '' });
      setError('');
    } catch (err) {
      setError('Erro ao adicionar produtor.');
    } finally {
      setAddingProducer(false);
      setShowForm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="jersey-15-charted-regular">Página do Administrador</h1>
      <button className="jersey-15-regular" onClick={handleLogout}>Sair</button>

      <h2 className="jersey-15-charted-regular">Adicionar Produtor</h2>
      <button className="jersey-15-regular" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Adicionar Produtor'}
      </button>

      {showForm && ( 
        <form onSubmit={handleAddProducer}>
          <input
            type="text"
            placeholder="Nome"
            className="lora-500"
            value={newProducer.name}
            onChange={(e) => setNewProducer({ ...newProducer, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="lora-500"
            value={newProducer.email}
            onChange={(e) => setNewProducer({ ...newProducer, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="lora-500"
            value={newProducer.password}
            onChange={(e) => setNewProducer({ ...newProducer, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            className="lora-500"
            value={newProducer.telefone}
            onChange={(e) => setNewProducer({ ...newProducer, telefone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Localização"
            className="lora-500"
            value={newProducer.localizacao}
            onChange={(e) => setNewProducer({ ...newProducer, localizacao: e.target.value })}
            required
          />
          <button className="jersey-15-regular" type="submit" disabled={addingProducer}>
            {addingProducer ? 'Adicionando...' : 'Adicionar Produtor'}
          </button>
        </form>
      )}

      <h2 className="jersey-15-charted-regular">Lista de Produtores</h2>
      {producers.length > 0 ? (
        <ul>
          {producers.map(producer => (
            <li key={producer._id} className="lora-500">
              {producer.name} - {producer.email}
              <button className="jersey-15-regular" onClick={() => handleDelete(producer._id)}>Excluir</button>
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

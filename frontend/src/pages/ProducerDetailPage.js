//Exibe os detalhes do produtor e permite gerenciar produtos (criar, editar, excluir).
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducerById, updateProducer, addProduct, updateProduct } from '../services/api';

const ProducerDetailPage = () => {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: '',
    localizacao: '',
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: '',
    pricePerKg: '',
    season: '',
  });
  const [productLoading, setProductLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducer = async () => {
      try {
        const data = await getProducerById(producerId);
        setProducer(data);
        setFormData({
          name: data.name,
          email: data.email,
          telefone: data.telefone || '',
          localizacao: data.localizacao || '',
        });
      } catch (err) {
        console.error('Erro ao carregar os detalhes do produtor:', err);
        setError('Erro ao carregar os detalhes do produtor');
      } finally {
        setLoading(false);
      }
    };

    fetchProducer();
  }, [producerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProducer(producerId, formData);
      setProducer({ ...producer, ...formData });
      setEditing(false);
    } catch (err) {
      console.error('Erro ao atualizar os dados do produtor:', err);
      setError('Erro ao atualizar os dados do produtor');
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({ ...productFormData, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      await addProduct(producerId, productFormData);
      setShowAddProductForm(false);
      setProductFormData({ name: '', category: '', pricePerKg: '', season: '' });
      const updatedProducer = await getProducerById(producerId);
      setProducer(updatedProducer);
    } catch (err) {
      console.error('Erro ao cadastrar o produto:', err);
      setError('Erro ao cadastrar o produto.');
    } finally {
      setProductLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      category: product.category,
      pricePerKg: product.pricePerKg,
      season: product.season,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct._id, productFormData);
      const updatedProducer = await getProducerById(producerId);
      setProducer(updatedProducer);
      setEditingProduct(null);
      setProductFormData({ name: '', category: '', pricePerKg: '', season: '' });
    } catch (err) {
      console.error('Erro ao atualizar o produto:', err);
      setError('Erro ao atualizar o produto.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="producer-detail-page">
      {editing ? (
        <form onSubmit={handleSave}>
          <h1>Editar {producer.name}</h1>
          <div>
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="telefone">Telefone</label>
            <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="localizacao">Endereço</label>
            <input type="text" id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleInputChange} />
          </div>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <div>
          <h1>{producer.name}</h1>
          <p>Email: {producer.email}</p>
          <p>Telefone: {producer.telefone || 'Não informado'}</p>
          <p>Endereço: {producer.localizacao || 'Não informado'}</p>
          <button onClick={() => setEditing(true)}>Editar</button>
          <button onClick={handleLogout}>Sair</button>
          <button onClick={() => setShowAddProductForm(true)}>Incluir Novo Produto</button>

          {showAddProductForm && (
            <form onSubmit={handleAddProduct}>
              <h2>Cadastrar Novo Produto</h2>
              <div>
                <label htmlFor="name">Nome do Produto</label>
                <input type="text" id="name" name="name" value={productFormData.name} onChange={handleProductInputChange} required />
              </div>
              <div>
                <label htmlFor="category">Categoria</label>
                <input type="text" id="category" name="category" value={productFormData.category} onChange={handleProductInputChange} required />
              </div>
              <div>
                <label htmlFor="pricePerKg">Preço por Kg</label>
                <input type="number" id="pricePerKg" name="pricePerKg" value={productFormData.pricePerKg} onChange={handleProductInputChange} required min="0" />
              </div>
              <div>
                <label htmlFor="season">Estação</label>
                <input type="text" id="season" name="season" value={productFormData.season} onChange={handleProductInputChange} />
              </div>
              <button type="submit" disabled={productLoading}>
                {productLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
              </button>
              <button type="button" onClick={() => setShowAddProductForm(false)}>Cancelar</button>
            </form>
          )}

          <h2>Produtos</h2>
          {producer && producer.products && producer.products.length > 0 ? (
            producer.products.map(product => (
              <div key={product._id}>
                <h3>{product.name}</h3>
                <p>Categoria: {product.category}</p>
                <p>Preço: R${product.pricePerKg} por kg</p>
                <p>Estação: {product.season || 'Não informado'}</p>
                <button onClick={() => handleEditProduct(product)}>Editar</button>
              </div>
            ))
          ) : (
            <p>Nenhum produto cadastrado.</p>
          )}

          {editingProduct && (
            <form onSubmit={handleUpdateProduct}>
              <h3>Editar Produto</h3>
              <div>
                <label htmlFor="name">Nome do Produto</label>
                <input type="text" id="name" name="name" value={productFormData.name} onChange={handleProductInputChange} required />
              </div>
              <div>
                <label htmlFor="category">Categoria</label>
                <input type="text" id="category" name="category" value={productFormData.category} onChange={handleProductInputChange} required />
              </div>
              <div>
                <label htmlFor="pricePerKg">Preço por Kg</label>
                <input type="number" id="pricePerKg" name="pricePerKg" value={productFormData.pricePerKg} onChange={handleProductInputChange} required min="0" />
              </div>
              <div>
                <label htmlFor="season">Estação</label>
                <input type="text" id="season" name="season" value={productFormData.season} onChange={handleProductInputChange} />
              </div>
              <button type="submit">Salvar Alterações</button>
              <button type="button" onClick={() => setEditingProduct(null)}>Cancelar</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ProducerDetailPage;

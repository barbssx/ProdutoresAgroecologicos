import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducerById, updateProducer, addProduct, deleteProduct } from '../services/api';
import './ProducerDetailPage.css';

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
    biografia: '',
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: '',
    pricePerKg: '',
    season: '',
  });
  const [productLoading, setProductLoading] = useState(false);

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
          biografia: data.biografia || '',
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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Você tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(producerId, productId);
        const updatedProducer = await getProducerById(producerId);
        setProducer(updatedProducer);
      } catch (err) {
        console.error('Erro ao excluir o produto:', err);
        setError('Erro ao excluir o produto.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="producer-detail-page">
      {editing ? (
        <form onSubmit={handleSave}>
          <h1 className='jersey-15-charted-regular'>Editar {producer.name}</h1>
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
          <div>
            <label htmlFor="biografia">Biografia</label>
            <textarea id="biografia" name="biografia" value={formData.biografia} onChange={handleInputChange} />
          </div>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <div>
          <h1 className='jersey-15-charted-regular'>{producer.name}</h1>
          <p>Email: {producer.email}</p>
          <p>Telefone: {producer.telefone || 'Não informado'}</p>
          <p>Endereço: {producer.localizacao || 'Não informado'}</p>
          <p>Biografia: {producer.biografia || 'Não informada'}</p>
          <button onClick={() => setEditing(true)}>Editar</button>
          <button onClick={handleLogout}>Sair</button>
          <button onClick={() => setShowAddProductForm(true)}>Incluir Novo Produto</button>

          {showAddProductForm && (
            <form onSubmit={handleAddProduct}>
              <h2 className='jersey-15-charted-regular'>Cadastrar Novo Produto</h2>
              <div>
                <label htmlFor="name">Nome do Produto</label>
                <input type="text" id="name" name="name" value={productFormData.name} onChange={handleProductInputChange} required />
              </div>
              <div>
                <label htmlFor="category">Categoria</label>
                <select id="category" name="category" value={productFormData.category} onChange={handleProductInputChange} required>
                  <option value="">Selecione uma categoria</option>
                  <option value="Queijos artesanais">Queijos artesanais</option>
                  <option value="Hortaliças">Hortaliças</option>
                  <option value="Leite e derivados">Leite e derivados</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Massas artesanais">Massas artesanais</option>
                  <option value="Artesanato">Artesanato</option>
                  <option value="Conservas">Conservas</option>
                  <option value="Doces">Doces</option>
                  <option value="Ervas medicinais">Ervas medicinais</option>
                  <option value="Flores">Flores</option>
                  <option value="Plantas">Plantas</option>
                </select>
              </div>
              <div>
                <label htmlFor="pricePerKg">Preço por Kg</label>
                <input type="number" id="pricePerKg" name="pricePerKg" value={productFormData.pricePerKg} onChange={handleProductInputChange} required min="0" />
              </div>
              <div>
                <label htmlFor="season">Estação</label>
                <select id="season" name="season" value={productFormData.season} onChange={handleProductInputChange} required>
                  <option value="">Selecione uma estação</option>
                  <option value="verão">Verão</option>
                  <option value="outono">Outono</option>
                  <option value="inverno">Inverno</option>
                  <option value="primavera">Primavera</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <button type="submit" disabled={productLoading}>
                {productLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
              </button>
              <button type="button" onClick={() => setShowAddProductForm(false)}>Cancelar</button>
            </form>
          )}

          <h2 className='jersey-15-charted-regular'>Produtos</h2>
          <div className="product-list">
            {producer && producer.products && producer.products.length > 0 ? (
              producer.products.map(product => (
                <div key={product._id} className="product-item">
                  <h3 className='jersey-15-charted-regular'>{product.name}</h3>
                  <p>
                    Categoria: <span className={`category ${product.category.toLowerCase().replace(/\s+/g, '-')}`}>{product.category}</span>
                  </p>
                  <p>Preço por Kg: R$ {product.pricePerKg}</p>
                  <p>Estação: {product.season}</p>
                  <button onClick={() => handleDeleteProduct(product._id)}>Excluir</button>
                </div>
              ))
            ) : (
              <p>Não há produtos cadastrados.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProducerDetailPage;

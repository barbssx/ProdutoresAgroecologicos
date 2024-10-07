import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProducerById, 
  updateProducer, 
  addProduct, 
  deleteProduct, 
  updateProduct 
} from '../services/api';
import './ProducerDetailPage.css';

const ProducerDetailPage = () => {
  const { producerId } = useParams();
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
      await updateProduct(producerId, editingProduct._id, productFormData);
      const updatedProducer = await getProducerById(producerId);
      setProducer(updatedProducer);
      setEditingProduct(null);
      setProductFormData({ name: '', category: '', pricePerKg: '', season: '' });
    } catch (err) {
      console.error('Erro ao atualizar o produto:', err);
      setError('Erro ao atualizar o produto');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <p className="lora-500">Carregando...</p>;
  if (error) return <p className="lora-500">{error}</p>;

  return (
    <main className="producer-detail-page">
      {editing ? (
        <form onSubmit={handleSave} className="lora-500">
          <h1 className='jersey-15-charted-regular'>Editar {producer.name}</h1>
          <div>
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
              className="lora-500"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              className="lora-500"
            />
          </div>
          <div>
            <label htmlFor="telefone">Telefone</label>
            <input 
              type="text" 
              id="telefone" 
              name="telefone" 
              value={formData.telefone} 
              onChange={handleInputChange} 
              className="lora-500"
            />
          </div>
          <div>
            <label htmlFor="localizacao">Endereço</label>
            <input 
              type="text" 
              id="localizacao" 
              name="localizacao" 
              value={formData.localizacao} 
              onChange={handleInputChange} 
              className="lora-500"
            />
          </div>
          <div>
            <label htmlFor="biografia">Biografia</label>
            <textarea 
              id="biografia" 
              name="biografia" 
              value={formData.biografia} 
              onChange={handleInputChange} 
              className="lora-500"
            />
          </div>
          <button type="submit" className="jersey-15-regular">Salvar</button>
          <button type="button" onClick={() => setEditing(false)} className="jersey-15-regular">Cancelar</button>
        </form>
      ) : (
        <div className="lora-500">
          <h1 className='jersey-15-charted-regular'>{producer.name}</h1>
          <p className="lora-500">Email: {producer.email}</p>
          <p className="lora-500">Telefone: {producer.telefone || 'Não informado'}</p>
          <p className="lora-500">Endereço: {producer.localizacao || 'Não informado'}</p>
          <p className="lora-500">Biografia: {producer.biografia || 'Não informada'}</p>

          <div className="button-group">
            <button onClick={() => setEditing(true)} className="jersey-15-regular">Editar</button>
            <button onClick={handleLogout} className="jersey-15-regular">Sair</button>
          </div>

          <h2 className='jersey-15-charted-regular'>Produtos</h2>
          <button onClick={() => setShowAddProductForm(true)} className="jersey-15-regular">Incluir Novo Produto</button>

          <div className="product-list">
            {producer.products && producer.products.length > 0 ? (
              producer.products.map(product => (
                <div key={product._id} className="product-item lora-500">
                  <h3 className='jersey-15-charted-regular'>{product.name}</h3>
                  <p className="lora-500">
                    Categoria: <span className={`category ${product.category.toLowerCase().replace(/\s+/g, '-')}`}>{product.category}</span>
                  </p>
                  <p className="lora-500">Preço por Kg: R$ {product.pricePerKg}</p>
                  <p className="lora-500">Estação: {product.season}</p>
                  <button onClick={() => handleEditProduct(product)} className="jersey-15-regular">Editar Produto</button>
                  <button onClick={() => handleDeleteProduct(product._id)} className="jersey-15-regular">Excluir</button>
                </div>
              ))
            ) : (
              <p className="lora-500">Não há produtos cadastrados.</p>
            )}
          </div>

          {showAddProductForm && !editingProduct && (
            <form onSubmit={handleAddProduct} className="lora-500">
              <h2 className='jersey-15-charted-regular'>Cadastrar Novo Produto</h2>
              <div>
                <label htmlFor="name">Nome do Produto</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={productFormData.name} 
                  onChange={handleProductInputChange} 
                  required 
                  className="lora-500"
                />
              </div>
              <div>
                          <label htmlFor="category">Categoria</label>
                          <select 
                            id="category" 
                            name="category" 
                            value={productFormData.category} 
                            onChange={handleProductInputChange} 
                            required
                          >
                            <option value="">Selecione uma categoria</option>
                            <option value="Queijos artesanais">Queijos artesanais</option>
                            <option value="Laticínios">Laticínios</option>
                            <option value="Doces">Doces</option>
                            <option value="Pães">Pães</option>
                            <option value="Conservas">Conservas</option>
                            <option value="Hortaliças">Hortaliças</option>
                            <option value="Legumes">Legumes</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Temperos">Temperos</option>
                            <option value="Grãos">Grãos</option>
                            <option value="Ovos">Ovos</option>
                            <option value="Carnes">Carnes</option>
                            <option value="Peixes">Peixes</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Mel">Mel</option>
                            <option value="Produtos Orgânicos">Produtos Orgânicos</option>
                          </select>
                        </div>

              <div>
                <label htmlFor="pricePerKg">Preço por Kg</label>
                <input 
                  type="number" 
                  id="pricePerKg" 
                  name="pricePerKg" 
                  value={productFormData.pricePerKg} 
                  onChange={handleProductInputChange} 
                  required 
                  className="lora-500"
                />
              </div>
              <div>
                  <label htmlFor="season">Estação</label>
                  <select 
                    id="season" 
                    name="season" 
                    value={productFormData.season} 
                    onChange={handleProductInputChange} 
                    required 
                    className="lora-500"
                  >
                    <option value="">Selecione a estação</option>
                    <option value="ANUAL">Anual</option>
                    <option value="VERÃO">Verão</option>
                    <option value="OUTONO">Outono</option>
                    <option value="INVERNO">Inverno</option>
                    <option value="PRIMAVERA">Primavera</option>
                  </select>
                </div>

              <button type="submit" disabled={productLoading} className="jersey-15-regular">
                {productLoading ? 'Carregando...' : 'Cadastrar'}
              </button>
              <button type="button" onClick={() => setShowAddProductForm(false)} className="jersey-15-regular">Cancelar</button>
            </form>
          )}

          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="lora-500">
              <h2 className='jersey-15-charted-regular'>Editar Produto</h2>
              <div>
                <label htmlFor="name">Nome do Produto</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={productFormData.name} 
                  onChange={handleProductInputChange} 
                  required 
                  className="lora-500"
                />
              </div>
              <div>
                <label htmlFor="category">Categoria</label>
                <select 
                  id="category" 
                  name="category" 
                  value={productFormData.category} 
                  onChange={handleProductInputChange} 
                  required
                  className="lora-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Queijos artesanais">Queijos artesanais</option>
                  <option value="Laticínios">Laticínios</option>
                  <option value="Doces">Doces</option>
                  <option value="Pães">Pães</option>
                  <option value="Conservas">Conservas</option>
                </select>
              </div>
              <div>
                <label htmlFor="pricePerKg">Preço por Kg</label>
                <input 
                  type="number" 
                  id="pricePerKg" 
                  name="pricePerKg" 
                  value={productFormData.pricePerKg} 
                  onChange={handleProductInputChange} 
                  required 
                  className="lora-500"
                />
              </div>
              <div>
                <label htmlFor="season">Estação</label>
                <select 
                  id="season" 
                  name="season" 
                  value={productFormData.season} 
                  onChange={handleProductInputChange} 
                  required 
                  className="lora-500"
                >
                  <option value="">Selecione a estação</option>
                  <option value="ANUAL">Anual</option>
                  <option value="VERÃO">Verão</option>
                  <option value="OUTONO">Outono</option>
                  <option value="INVERNO">Inverno</option>
                  <option value="PRIMAVERA">Primavera</option>
                </select>
              </div>

              <button type="submit" className="jersey-15-regular">Atualizar</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="jersey-15-regular">Cancelar</button>
            </form>
          )}
        </div>
      )}
    </main>
  );
};

export default ProducerDetailPage;

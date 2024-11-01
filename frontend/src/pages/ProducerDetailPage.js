import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProducerById,
  updateProducer,
  addProduct,
  deleteProduct,
  updateProduct,
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
    icon: '',
    category: '',
    pricePerKg: '',
    unit: '',
    season: [],
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

    if (!productFormData.pricePerKg) {
        setError('O preço é obrigatório.'); 
        setProductLoading(false); 
        return;
    }

    try {
        
        await addProduct(producerId, productFormData);
        setShowAddProductForm(false);
        
        setProductFormData({ name: '',icon: '', category: '', pricePerKg: '', unit: '', season: [] });
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
      icon: product.icon || '',            
      category: product.category,       
      pricePerKg: product.price,             
      unit: product.unit,       
      season: product.season || [],
          
    });
    
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!productFormData.pricePerKg) {
        setError('O preço é obrigatório.'); 
        return;
    }

    try {
        await updateProduct(producerId, editingProduct._id, productFormData);
        const updatedProducer = await getProducerById(producerId);
        setProducer(updatedProducer);
        setEditingProduct(null);
        setProductFormData({ name: '', category: '', pricePerKg: '', unit: '', season: [] });
    } catch (err) {
        console.error('Erro ao atualizar o produto:', err);
        setError('Erro ao atualizar o produto');
    }
};


  const handleSeasonChange = (season) => {
    try {
      setProductFormData((prevState) => {
        const isSelected = prevState.season.includes(season);
        return {
          ...prevState,
          season: isSelected 
            ? prevState.season.filter((s) => s !== season)
            : [...prevState.season, season]
        };
      });
    } catch (err) {
      console.error('Erro ao atualizar a estação:', err);
      setError((prevErrors) => ({
        ...prevErrors,
        season: 'Erro ao atualizar a estação.',
      }));
    }
  };
  
  

  const handleSeasonChipClick = (season) => {
    setProductFormData(prevState => {
      const isSelected = prevState.season.includes(season);
      return {
        ...prevState,
        season: isSelected
          ? prevState.season.filter(s => s !== season) 
          : [...prevState.season, season] 
      };
    });
  };

  const SeasonChip = ({ season }) => {
    const colors = {
      Primavera: 'lightgreen',
      Verão: 'yellow',
      Outono: 'orange',
      Inverno: 'lightblue',
      Anual: 'lightgrey',
    };
  
    return (
      <span 
        className="season-chip" 
        style={{ backgroundColor: colors[season] || 'black', padding: '5px', borderRadius: '5px', margin: '2px', color: 'black' }}
      >
        {season}
      </span>
    );
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const closeModal = () => {
    setEditing(false);
    setShowAddProductForm(false);
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: '',
      pricePerKg: '',
      unit: '',
      season: '',
    });
    
  };

  if (loading) return <p className="jersey-15-regular">Carregando...</p>;
  if (error) return <p className="jersey-15-regular">{error}</p>;

  return (
    <main className="producer-detail-page">
      <div class="producer-info">
      <h1 className='jersey-15-charted-regular'>{producer.name}</h1>
      <p className="jersey-15-regular"><strong>E-mail:</strong> {producer.email}</p>
      <p className="jersey-15-regular"><strong>Telefone:</strong> {producer.telefone || 'Não informado'}</p>
      <p className="jersey-15-regular"><strong>Endereço:</strong> {producer.localizacao || 'Não informado'}</p>
      <p className="jersey-15-regular"><strong>Biografia: </strong>{producer.biografia || 'Não informada'}</p>

      <div className="button-group">
        <button onClick={() => setEditing(true)} className="jersey-15-regular btn-produto">Editar</button>
        <button onClick={handleLogout} className="jersey-15-regular btn-produto">Sair</button>
      </div>
      </div>

  
      <h2 className='jersey-15-charted-regular'>Produtos</h2>
      <button onClick={() => setShowAddProductForm(true)} className="jersey-15-regular btn-incluir">Incluir Novo Produto</button>

      <div className="product-list">
  {producer.products && producer.products.length > 0 ? (
    producer.products.map(product => (
      <div key={product._id} className="product-item jersey-15-regular">
        <h3 className='jersey-15-charted-regular'>{product.name}</h3>
        <p className="jersey-15-regular">
          Categoria: <span className={`category ${product.category.toLowerCase().replace(/\s+/g, '-')}`}>{product.category}</span>
        </p>
        <p className="jersey-15-regular">Preço {product.pricePerKg} R$ por {product.unit}</p>
        <p className="jersey-15-regular">
          Estação: {product.season.map(season => (
            <SeasonChip key={season} season={season} />
          ))}
        </p>
        <button onClick={() => handleEditProduct(product)} className="jersey-15-regular btn-produto">Editar</button>
        <button onClick={() => handleDeleteProduct(product._id)} className="jersey-15-regular btn-produto">Excluir</button>
      </div>
    ))
  ) : (
    <p className="jersey-15-regular">Não há produtos cadastrados.</p>
  )}
</div>



      

      {/* Modal Editar Produtor */}
{editing && (
  <div className="modal">
    <div className="modal-content">
      <form onSubmit={handleSave} className="jersey-15-regular">
        <h2 className='jersey-15-charted-regular'>Editar {producer.name}</h2>
        
        {/* Campos do formulário */}
        <div>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="jersey-15-regular"
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
            className="jersey-15-regular"
            placeholder="exemplo@hotmail.com"
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
            className="jersey-15-regular"
            placeholder="+55 11987654321"
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
            className="jersey-15-regular"
          />
        </div>
        <div>
          <label htmlFor="biografia">Biografia</label>
          <textarea
            className="biografia-box jersey-15-regular"
            id="biografia"
            name="biografia"
            placeholder="Escreva sua biografia aqui. No máximo 150 letras"
            value={formData.biografia}
            onChange={handleInputChange}
            maxLength="150"
          />
        </div>
        
        {/* Botões de ação */}
        <div className="modal-footer">
        <button type="submit" className="btn-save jersey-15-regular">Salvar</button>
        <button type="button" className="btn-close jersey-15-regular" onClick={closeModal}>Fechar</button>
        </div>
      </form>
    </div>
  </div>
)}


                    
                   {/* Modal Add Produto */}
              {showAddProductForm && (
                <div className="modal">
                  <div className="modal-content">
                    <form onSubmit={handleAddProduct} className="jersey-15-regular">
                      <h2 className='jersey-15-charted-regular'>Novo Produto</h2>
                      <div>
                        <label htmlFor="name">Nome do Produto</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={productFormData.name}
                          onChange={handleProductInputChange}
                          required
                          className="jersey-15-regular"
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
                          className="jersey-15-regular"
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="Artesanal">Artesanal</option>
                          <option value="Bebidas">Bebidas</option>
                          <option value="Bolos e Tortas">Bolos e Tortas</option>
                          <option value="Compota">Compota</option>
                          <option value="Carnes">Carnes</option>
                          <option value="Conservas">Conservas</option>
                          <option value="Doces">Doces</option>
                          <option value="Ervas Medicinais">Ervas Medicinais</option>
                          <option value="Flores">Flores</option>
                          <option value="Frutas">Frutas</option>
                          <option value="Grãos">Grãos</option>
                          <option value="Hortaliças">Hortaliças</option>
                          <option value="Legumes">Legumes</option>
                          <option value="Laticínios">Laticínios</option>
                          <option value="Massas Artesanais">Massas Artesanais</option>
                          <option value="Mel">Mel</option>
                          <option value="Ovos">Ovos</option>
                          <option value="Padaria">Padaria</option>
                          <option value="Plantas">Plantas</option>
                          <option value="Queijos Artesanais">Queijos Artesanais</option>
                          <option value="Temperos">Temperos</option>
                          <option value="Verduras">Verduras</option>
                        </select>
                      </div>

                      {/* Campo Preço */}
                      <div>
                        <label htmlFor="pricePerKg">Preço:</label>
                        <input
                          type="number"
                          id="pricePerKg"
                          name="pricePerKg"
                          value={productFormData.pricePerKg}
                          onChange={handleProductInputChange}
                          required
                          className="jersey-15-regular"
                        />
                      </div>

                      {/* Campo Unidade de Medida */}
                      <div>
                        <label htmlFor="unit">Unidade de Medida</label>
                        <select
                          id="unit"
                          name="unit"
                          value={productFormData.unit}
                          onChange={handleProductInputChange}
                          required
                          className="jersey-15-regular"
                        >
                          <option value="">Selecione uma unidade de medida</option>
                          <option value="UN">UN</option>
                          <option value="KG">KG</option>
                          <option value="L">L</option>
                        </select>
                      </div>

                      {/* Campo Estação com Chips */}
                      <div>
                        <label>Estação</label>
                        <div className="chip-container">
                          {['Anual', 'Verão', 'Outono', 'Inverno', 'Primavera'].map((season) => (
                            <span 
                              key={season} 
                              onClick={() => handleSeasonChange(season)} 
                              className={`chip ${productFormData.season.includes(season) ? 'selected' : ''}`}
                            >
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botões Adicionar e Fechar */}
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <button type="submit" disabled={productLoading} className="modal-button">
                          {productLoading ? 'Carregando...' : 'Adicionar'}
                        </button>
                        <button type="button" onClick={closeModal} className="modal-button">
                          Fechar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}


                         
                              {/* Modal Editar */}
              {editingProduct && (
                <div className="modal">
                  <div className="modal-content">
                    <form onSubmit={handleUpdateProduct} className="jersey-15-regular">
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
                          className="jersey-15-regular"
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
                          className="jersey-15-regular"
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="Artesanal">Artesanal</option>
                          <option value="Bebidas">Bebidas</option>
                          <option value="Bolos e Tortas">Bolos e Tortas</option>
                          <option value="Compota">Compota</option>
                          <option value="Carnes">Carnes</option>
                          <option value="Conservas">Conservas</option>
                          <option value="Doces">Doces</option>
                          <option value="Ervas Medicinais">Ervas Medicinais</option>
                          <option value="Flores">Flores</option>
                          <option value="Frutas">Frutas</option>
                          <option value="Grãos">Grãos</option>
                          <option value="Hortaliças">Hortaliças</option>
                          <option value="Legumes">Legumes</option>
                          <option value="Laticínios">Laticínios</option>
                          <option value="Massas Artesanais">Massas Artesanais</option>
                          <option value="Mel">Mel</option>
                          <option value="Ovos">Ovos</option>
                          <option value="Padaria">Padaria</option>
                          <option value="Plantas">Plantas</option>
                          <option value="Queijos Artesanais">Queijos Artesanais</option>
                          <option value="Temperos">Temperos</option>
                          <option value="Verduras">Verduras</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pricePerKg">Preço:</label>
                        <input
                          type="number"
                          id="pricePerKg"
                          name="pricePerKg"
                          value={productFormData.pricePerKg}
                          onChange={handleProductInputChange}
                          required
                          className="jersey-15-regular"
                        />
                      </div>

                      {/* Campo Unidade de Medida */}
                      <div>
                        <label htmlFor="unit">Unidade de Medida</label>
                        <select
                          id="unit"
                          name="unit"
                          value={productFormData.unit}
                          onChange={handleProductInputChange}
                          required
                          className="jersey-15-regular"
                        >
                          <option value="">Selecione uma unidade de medida</option>
                          <option value="UN">UN</option>
                          <option value="KG">KG</option>
                          <option value="L">L</option>
                        </select>
                      </div>

                      {/* Campo Estação com Chips */}
                      <div>
                        <label>Estações</label>
                        <div className="chip-container">
                          {["Anual", "Verão", "Outono", "Inverno", "Primavera"].map(season => (
                            <span
                              key={season}
                              className={`chip ${productFormData.season.includes(season) ? 'selected' : ''}`}
                              onClick={() => handleSeasonChipClick(season)}
                            >
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="submit" className="modal-button">Atualizar</button>
                        <button type="button" className="modal-button" onClick={closeModal} style={{ marginLeft: '10px' }}>
                          Fechar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

    </main>
  );
};

export default ProducerDetailPage;

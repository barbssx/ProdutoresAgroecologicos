import React, { useEffect, useState } from 'react';
import './ProducerProfile.css';

const ProducerProfile = ({ producerId }) => {
  const [producer, setProducer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducer = async () => {
      try {
        const response = await fetch(`/api/producers/${producerId}`);
        if (!response.ok) throw new Error(response.statusText);
        
        const data = await response.json();
        setProducer(data);
      } catch (err) {
        console.error('Erro ao carregar o produtor:', err);
        setError('Erro ao carregar os dados do produtor.');
      }
    };

    fetchProducer();
  }, [producerId]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Telefone não disponível';
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11
      ? `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 3)}${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`
      : 'Telefone inválido';
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? email : 'Email inválido';
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!producer) {
    return <p>Carregando...</p>;
  }

  const { name, localizacao, products, photo, telefone, biografia, email } = producer;

  return (
    <div className="producer-profile">
      <div className="profile-header">
        <img 
          src={photo || '/default-profile.png'} 
          alt={`${name}'s profile`} 
          className="profile-photo" 
        />
        <h2 className="producer-name">{name}</h2>
        <p className="producer-location">{localizacao || 'Localização não disponível'}</p>
        <p className="producer-phone">{formatPhoneNumber(telefone)}</p>
        <p className="producer-email">{validateEmail(email) || 'Email não disponível'}</p>
        <p className="producer-biography">{biografia || 'Biografia não disponível'}</p>
      </div>
      <div className="profile-products">
        <h3>Produtos</h3>
        {products && products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                {product.name || 'Produto não especificado'} - 
                <span className={`category ${product.category.replace(/\s+/g, '-').toLowerCase()}`}>
                  {product.category || 'Categoria não especificada'}
                </span> - 
                R${product.pricePerKg !== undefined ? product.pricePerKg.toFixed(2) : 'Preço não disponível'} por kg - 
                {product.season || 'Estação não especificada'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem produtos disponíveis.</p>
        )}
      </div>
    </div>
  );
};

export default ProducerProfile;

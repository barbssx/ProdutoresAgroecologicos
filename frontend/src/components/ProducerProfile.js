//Exibe os detalhes do perfil do produtor, como suas informações pessoais e, possivelmente, seus produtos. 
//É responsável por renderizar a interface onde os produtores podem visualizar ou editar seus dados.

import React from 'react';
import './ProducerProfile.css';

const ProducerProfile = ({ producer }) => {
  const { name, localizacao, products, photo, telefone } = producer;

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
        <p className="producer-phone">{telefone ? `Telefone: ${telefone}` : 'Telefone não disponível'}</p>
      </div>
      <div className="profile-products">
        <h3>Produtos</h3>
        {products && products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                {product.name || 'Produto não especificado'} - 
                {product.category || 'Categoria não especificada'} - 
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

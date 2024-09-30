// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleProducerLogin = () => {
    console.log("Redirecionando para o login...");
    navigate('/login'); 
  };

  const handleConsumerView = () => {
    console.log("Redirecionando para a lista de produtores...");
    navigate('/producers'); 
  };

  return (
    <div className="homepage-container">
      <h1>Bem-vindo à nossa plataforma agroecológica!</h1>
      <p className="homepage-info">
        Produtos agroecológicos são sazonais, garantindo frescor e sustentabilidade. 
        Tenha paciência ao escolher produtos, pois sua disponibilidade varia de acordo com as estações.
      </p>

      <div className="homepage-divs-container">
        {/* Div para Produtores */}
        <div className="homepage-div" onClick={handleProducerLogin}>
          <h3>Se você é um produtor</h3>
          <p>Faça o login para acessar sua conta e gerenciar seus produtos.</p>
        </div>

        {/* Div para Consumidores */}
        <div className="homepage-div" onClick={handleConsumerView}>
          <h3>Se você é um consumidor</h3>
          <p>Veja os produtores e descubra os produtos disponíveis.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleProducerLogin = () => {
    navigate('/login'); 
  };

  const handleConsumerView = () => {
    navigate('/producers'); 
  };

  return (
    <div className="homepage-container">
      <h1 className="jersey-15-charted-regular">Bem-vindo à nossa plataforma agroecológica!</h1>
      
      <img src="/assets/pixel-farm.gif" alt="Fazenda pixel art" className="homepage-image" />

      <p className="homepage-info lora-500">
        Produtos agroecológicos são sazonais, garantindo frescor e sustentabilidade. 
        Tenha paciência ao escolher produtos, pois sua disponibilidade varia de acordo com as estações.
      </p>

      <div className="homepage-divs-container">
        <div 
          className="homepage-div" 
          onClick={handleProducerLogin} 
          role="button" 
          tabIndex={0} 
          onKeyPress={(e) => e.key === 'Enter' && handleProducerLogin()}
        >
          <h3 className="jersey-15-charted-regular">Se você é um produtor</h3>
          <p className="lora-500">Faça o login para acessar sua conta e gerenciar seus produtos.</p>
        </div>

        <div 
          className="homepage-div" 
          onClick={handleConsumerView} 
          role="button" 
          tabIndex={0} 
          onKeyPress={(e) => e.key === 'Enter' && handleConsumerView()}
        >
          <h3 className="jersey-15-charted-regular">Se você é um consumidor</h3>
          <p className="lora-500">Veja os produtores e descubra os produtos disponíveis.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

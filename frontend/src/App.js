//Onde as rotas e a estrutura principal da aplicação são definidas. Onde fica a lógica da api

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProducerDetailPage from './pages/ProducerDetailPage';
import HomePage from './pages/HomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/producers/:producerId" element={<ProducerDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

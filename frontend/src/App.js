import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProducersPage from './pages/ProducersPage';
import ProducerDetailPage from './pages/ProducerDetailPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/producers/:producerId" element={<ProducerDetailPage />} />
        <Route path="/producers" element={<ProducersPage />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;

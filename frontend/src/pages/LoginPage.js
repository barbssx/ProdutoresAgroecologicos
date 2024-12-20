import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      console.log('Dados retornados:', data); 
      localStorage.setItem('token', data.token);

      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate(`/producers/${data.producerId}`); 
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src="/assets/duck-ducky.gif" alt="Patinho" className="login-image" />
      <div className="login-container">
        <div className="container-login">
          <h1 className="jersey-15-charted-regular">Produtor, faça o seu login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="jersey-15-regular" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="jersey-15-regular" htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="jersey-15-regular btn-submit" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
      <div className="footer" />
    </div>
);

};

export default LoginPage;

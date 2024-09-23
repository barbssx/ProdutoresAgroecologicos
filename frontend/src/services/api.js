//Essencial para a comunicação do frontend com o backend, sendo o ponto central onde todas as requisições HTTP são realizadas.
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Função de login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
    throw error; 
  }
};

// Função para pegar todos os produtores
export const getProducers = async () => {
  try {
    const response = await api.get('/producers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produtores:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para pegar os produtos de um produtor específico
export const getProductsByProducer = async (producerId) => {
  try {
    const response = await api.get(`/producers/${producerId}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produtos do produtor:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para pegar os detalhes de um produtor específico
export const getProducerById = async (producerId) => {
  try {
    const response = await api.get(`/producers/${producerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter detalhes do produtor:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para atualizar os dados do produtor
export const updateProducer = async (producerId, updatedData) => {
  try {
    const response = await api.put(`/producers/${producerId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar o produtor:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para cadastrar um novo produto
export const addProduct = async (producerId, productData) => {
  try {
    const response = await api.post(`/producers/${producerId}/products`, productData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para atualizar um produto
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await api.put(`/products/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error.response ? error.response.data : error.message);
    throw error;
  }
};

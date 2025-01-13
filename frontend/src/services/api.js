import axios from 'axios';

// Substitua pela URL do seu backend
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do backend
});

export default api;
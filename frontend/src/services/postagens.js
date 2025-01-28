import api from './api';

export const fetchPostagens = async () => {
  try {
    const response = await api.get('/postagens');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postagens:', error.response?.data || error.message);
    throw error;
  }
};

// Você pode adicionar outras funções, como criar, editar ou deletar postagens.
export const criarPostagem = async (texto,fotos) => {
    try {
      const response = await api.post('/postagens', { texto, fotos }); // Requisição POST
      return response.data;
    } catch (error) {
      console.error('Erro ao criar postagem:', error.response?.data || error.message);
      throw error;
    }
  };
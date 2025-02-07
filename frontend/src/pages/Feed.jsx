import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Post from '../components/Post';
import NovoPost from "../components/NovoPost"
import api from '../services/api';
import { toast } from 'react-toastify';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/postagens');
      setPosts(response.data);
    } catch (error) {
      if (!error.response?.status === 401) {
        toast.error('Erro ao carregar o feed');
      }
    } finally {
      setLoading(false);
    }
  };

  const buscarPostagens = () => {
    fetchPosts(); // Essa função será chamada quando um novo post for criado
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Componente NovoPost deve ser renderizado dentro do JSX */}
      <NovoPost onPostCriado={buscarPostagens} />
      
      {posts.map((post) => (
        <Post key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </Box>
  );
};

export default Feed;
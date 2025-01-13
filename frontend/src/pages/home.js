import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Buscar os posts do backend
    api.get('/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar posts:', error);
      });
  }, []);

  return (
    <div>
      <h1>Mini Insta</h1>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>Carregando posts...</p>
        )}
      </div>
    </div>
  );
};

export default Home;

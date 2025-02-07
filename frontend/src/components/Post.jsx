import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Send } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { toast } from 'react-toastify';

const Post = ({ post = {}, onUpdate }) => {
  // Verificação para garantir que post não seja undefined
  if (!post || !post.usuario) {
    console.log("Post inválido:", post);
    return null; // Ou um loader: <p>Carregando post...</p>
  }

  console.log("Dados do post:", post); // Depuração

  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurtir = async () => {
    try {
      await api.post(`/postagens/${post.id}/curtir`);
      onUpdate();
    } catch (error) {
      toast.error('Erro ao curtir a postagem');
    }
  };

  const handleComentar = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setLoading(true);
    try {
      await api.post(`/postagens/${post.id}/comentar`, { texto: comentario });
      setComentario('');
      onUpdate();
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={post.usuario?.avatar} alt={post.usuario?.nome}>
            {post.usuario?.nome ? post.usuario.nome[0] : "?"}
          </Avatar>
        }
        title={post.usuario?.nome || "Usuário desconhecido"}
        subheader={post.created_at ? formatDistanceToNow(new Date(post.created_at), {
          addSuffix: true,
          locale: ptBR,
        }) : "Data desconhecida"}
      />

      {post.imagem && (
        <CardMedia
          component="img"
          image={post.imagem}
          alt="Post"
          sx={{ maxHeight: 600, objectFit: 'contain' }}
        />
      )}

      <CardActions disableSpacing>
        <IconButton onClick={handleCurtir}>
          {post.curtido ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <IconButton>
          <ChatBubbleOutline />
        </IconButton>
      </CardActions>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.curtidas || 0} curtidas
        </Typography>

        <Typography variant="body1" component="p" sx={{ mt: 1 }}>
          <strong>{post.usuario?.nome || "Usuário"}</strong> {post.texto || ""}
        </Typography>

        {Array.isArray(post.comentarios) && post.comentarios.length > 0 ? (
          post.comentarios.map((comentario) => (
            <Typography key={comentario.id} variant="body2" sx={{ mt: 1 }}>
              <strong>{comentario.usuario?.nome || "Anônimo"}</strong> {comentario.texto}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Nenhum comentário ainda.
          </Typography>
        )}

        <Box component="form" onSubmit={handleComentar} sx={{ mt: 2, display: 'flex' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Adicione um comentário..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={loading}
          />
          <IconButton type="submit" disabled={loading || !comentario.trim()}>
            <Send />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;
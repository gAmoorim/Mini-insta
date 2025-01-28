import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    avatar: '',
  });

  const fetchPerfil = async () => {
    try {
      const response = await api.get('/perfil');
      setPerfil(response.data);
      setFormData({
        nome: response.data.nome,
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
      });
    } catch (error) {
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put('/perfil', formData);
      toast.success('Perfil atualizado com sucesso!');
      fetchPerfil();
      setOpenEdit(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar
          src={perfil.avatar}
          alt={perfil.nome}
          sx={{ width: 150, height: 150, mr: 4 }}
        />
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              {perfil.username}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setOpenEdit(true)}
            >
              Editar Perfil
            </Button>
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {perfil.nome}
          </Typography>
          {perfil.bio && (
            <Typography variant="body2" color="text.secondary">
              {perfil.bio}
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            fullWidth
            label="Bio"
            margin="normal"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <TextField
            fullWidth
            label="URL do Avatar"
            margin="normal"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        {perfil.postagens?.map((post) => (
          <Grid item xs={4} key={post.id}>
            <img
              src={post.imagem}
              alt="Post"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Perfil;
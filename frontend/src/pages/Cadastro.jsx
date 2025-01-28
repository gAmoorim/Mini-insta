import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/cadastro', {
        nome,
        email,
        username,
        senha,
      });
      toast.success('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.erro || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 4,
              fontFamily: 'Grand Hotel, cursive',
              fontSize: '3rem',
            }}
          >
            Instagram
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome completo"
              margin="normal"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Nome de usuário"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 2 }}>
            Já tem uma conta?{' '}
            <Link component={RouterLink} to="/login">
              Faça login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Cadastro;
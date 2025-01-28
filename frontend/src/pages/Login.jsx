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
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { login, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      navigate('/app');
    } catch (error) {
      toast.error(error.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src="https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe239b7c9f.png"
              alt="Instagram mobile"
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
                  label="Email ou username"
                  margin="normal"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
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
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Box>

              <Typography align="center" sx={{ mt: 2 }}>
                Não tem uma conta?{' '}
                <Link component={RouterLink} to="/cadastro">
                  Cadastre-se
                </Link>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
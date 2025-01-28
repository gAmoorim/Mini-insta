import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Home,
  Search as SearchIcon,
  AccountCircle,
  Close as CloseIcon,
} from '@mui/icons-material';
import api from '../services/api';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        const response = await api.get(`/usuarios/buscar?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = (username) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/perfil/${username}`);
  };

  return (
    <AppBar position="fixed" color="default" sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontFamily: 'Grand Hotel, cursive',
            fontSize: '2rem',
            color: 'black',
            textDecoration: 'none',
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          Instagram
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Pesquisar">
            <IconButton onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton component={Link} to="/" color="inherit">
            <Home />
          </IconButton>
          <Tooltip title="Perfil">
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt={usuario.nome}
                src={usuario.avatar}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem component={Link} to="/perfil">Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={searchOpen}
          onClose={() => {
            setSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Search sx={{ flexGrow: 1 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar…"
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
              />
            </Search>
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {searchResults.map((user) => (
              <ListItem
                button
                key={user.id}
                onClick={() => handleUserClick(user.username)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.nome}>
                    {user.nome[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.nome}
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
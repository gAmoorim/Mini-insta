import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 3, mt: 8 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
require('dotenv').config();

const express = require('express');
const login = require('../controllers/login');
const usuarios = require('../controllers/usuarios');
const postagens = require('../controllers/postagens');
const verificarLogin = require('../utils/verificarLogin');

const rotas = express();

//cadastro de usuario
rotas.post('/cadastro', usuarios.cadastrarUsuario);

//login
rotas.post('/login', login.login);

//filtro para verificar usuario logado
rotas.use(verificarLogin);

//obter e atualizar perfil do usuario logado
rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.atualizarPerfil);

//postagens
rotas.post('/postagens', postagens.uploadFotos, postagens.novaPostagem)
rotas.get('/postagens', postagens.feed)
rotas.post('/postagens/:postagemId/curtir', postagens.curtir)
rotas.post('/postagens/:postagemId/comentar', postagens.comentar)

module.exports = rotas;
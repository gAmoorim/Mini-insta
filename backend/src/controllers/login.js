require('dotenv').config();
const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json('Informe o login (email ou username) e a senha');
    }

    try {
        const usuario = await knex('usuarios')
        .where({ email: login })
        .orWhere({ username: login })
        .first();

        if (!usuario) {
            return res.status(404).json('Usuário não encontrado');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json('Login ou senha inválidos');
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            email: usuario.email
        };

        const token = jwt.sign(dadosTokenUsuario, process.env.JWT_PWD, { expiresIn: '2h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json('Erro no servidor, tente novamente mais tarde');
    }
};

module.exports = {
    login
};
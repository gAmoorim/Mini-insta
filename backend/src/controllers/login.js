require('dotenv').config();
const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, senha } = req.body;

    if (!username || !senha) {
        return res.status(400).json('É obrigatório informar username e senha');
    }
    
    try {
        const usuario = await knex('usuarios').where({ username }).first();

        if (!usuario) {
            return res.status(404).json('Usuario não encontrado');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json('email ou senha inválido')
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            username: usuario.username
        }

        const token = jwt.sign(dadosTokenUsuario, process.env.SENHASEGURA, { expiresIn: '2h' });

        const {senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })

    } catch (error) {
        return res.status(400).json(error.message)
    }

}

module.exports = {
    login
};
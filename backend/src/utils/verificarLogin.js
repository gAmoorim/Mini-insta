require('dotenv').config();
const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(400).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token,process.env.JWT_PWD);

        const usuarioExiste = await knex('usuarios').where({id}).first();

        if (!usuarioExiste) {
            return res.status(400).json('Token inválido');
        }

        const { senha, ...usuario } = usuarioExiste;
        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificarLogin
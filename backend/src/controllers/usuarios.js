const knex = require('../database/connection');
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req, res) => {
    const {username, senha, email, nome} = req.body;

    if (!username || !nome || !email || !senha || senha.length < 5) {
        return res.status(400).json('Campo obrigatório não preenchido');
    }

    try {
        const usuarioExistente = await knex('usuarios').where({ username }).first();

        if (usuarioExistente) {
            return res.status(400).json('O username informado já existe');
        }

        const emailExistente = await knex('usuarios').where({ email }).first();

        if (emailExistente) {
            return res.status(400).json('O email informado já existe');
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({
            username,
            nome,
            email,
            senha: senhaCriptografada
        });

        if (!usuario) {
            return res.status(400).json('O usuário nao foi cadastrado');
        }

        return res.status(201).json('Usuário cadastrado com sucesso');
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario)
}

const atualizarPerfil = async (req, res) => {
    let {
        nome,
        email,
        senha,
        imagem,
        username,
        site,
        bio,
        telefone,
        genero
    } = req.body

    const { id } = req.usuario;

    if (!nome && !email && !senha && !imagem && !username && !site && !bio && !telefone && !genero) {
        return res.status(400).json('é obrigatório informar ao menos um campo para atualização.');
    }

    try {
        if (senha) {
            if (senha.length < 5) {
                return res.status(400).json('A senha deve conter, no mínimo, 5 caracteres.');
            }
            senha = await bcrypt.hash(senha, 10);
        }

        if (email !== req.usuario.email) {
            const emailExistente = await knex('usuarios').where({ email }).first();

            if (emailExistente) {
                return res.status(400).json('o Email ja existe.');
            }
        }

        if (username !== req.usuario.username) {
            const usernameExistente = await knex('usuarios').where({ username }).first();

            if (usernameExistente) {
                return res.status(400).json('o Username ja existe.');
            }
        }

        const usuarioAtualizado = await knex('usuarios')
        .where({ id })
        .update({
            nome,
            email,
            senha,
            imagem,
            username,
            site,
            bio,
            telefone,
            genero
        });

        if (!usuarioAtualizado) {
            return res.status(400).json('O usuario não foi atualizado');
        }

        return res.status(200).json('Usuario foi atualizado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
};
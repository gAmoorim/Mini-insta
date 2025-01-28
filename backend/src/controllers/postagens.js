const knex = require('../database/connection');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Certifique-se de que a pasta existe
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
    }
});

const upload = multer({ storage: storage });

const novaPostagem = async (req,res) => {
    const {id} = req.usuario;
    const {texto} = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json('É preciso informar pelo menos uma imagem');
    }

    
    try {
        const postagem = await knex('postagens')
        .insert({texto, usuario_id: id})
        .returning('*');
        
        if (!postagem) {
            return res.status(400).json('Não foi possível concluir a postagem');
        }

        const fotos = req.files.map(file => ({
            postagem_id: postagem[0].id,
            url: file.path,
            nome: file.filename,
            imagem: file.filename
        }));

        const fotosCadastradas = await knex('postagem_fotos').insert(fotos);

        if (!fotosCadastradas || fotosCadastradas.length === 0) {
            await knex('postagens').where({ id: postagem[0].id }).del();
            return res.status(400).json('Não foi possível concluir a postagem');
        }

        return res.status(200).json('Postagem realizada com sucesso');
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const uploadFotos = upload.array('fotos');

const curtir = async (req, res) => {
    const { id } = req.usuario;
    const { postagemId } = req.params;

    try {
        const postagem = await knex('postagens').where({id: postagemId}).first();

        if (!postagem) {
            return res.status(404).json('Essa postragem não existe');
        }

        const jaCurtiu = await knex('postagem_curtidas')
        .where({ usuario_id: id, postagem_id: postagem.id})
        .first();

        if (jaCurtiu) {
            return res.status(400).json('O usuário ja curtiu essa postagem');
        }

        const curtida = await knex('postagem_curtidas')
        .insert({
            usuario_id: id,
            postagem_id: postagem.id
        });

        if (!curtida) {
            return res.status(400).json('Não foi possível curtir essa postagem');
        }

        return res.status(200).json('Postagem curtida com sucesso.');
    } catch (error) {
       return res.status(400).json(error.message);
    }
}

const comentar = async (req, res) => {
    const { id } = req.usuario;
    const { postagemId } = req.params;
    const { texto } = req.body

    if (!texto) {
        return res.status(400).json('Para comentar, é necessário informar o texto.')
    }

    try {
        const postagem = await knex('postagens').where({id: postagemId}).first();

        if (!postagem) {
            return res.status(404).json('Essa postagem não existe');
        }

        const comentario = await knex('postagem_comentarios')
        .insert({
            texto,
            usuario_id: id, 
            postagem_id: postagemId
        })

        if (!comentario) {
            return res.status(400).json('Não foi possível comentar essa postagem');
        }

        return res.status(200).json('Postagem comentada com sucesso.');
    } catch (error) {
       return res.status(400).json(error.message);
    }
}

const feed = async (req, res) => {
    const { id } = req.usuario;
    const { offset } = req.query;

    const o = offset ? offset : 0;

    try {
        //const postagens = knex('postagens').limit(10).offset(pagina);
        const postagens = await knex('postagens')
        .where('usuario_id', "!=", id)
        .limit(10)
        .offset(o);

        if (postagens.length === 0) {
            return res.status(200).json(postagens)
        }

        for (const postagem of postagens) {
            // usuario
            const usuario = await knex('usuarios')
            .where({ id: postagem.usuario_id})
            .select('imagem', 'username', 'verificado')
            .first();
            postagem.usuario = usuario;

            //fotos
            const fotos = await knex('postagem_fotos')
            .where({postagem_id: postagem.id})
            .select('imagem');
            postagem.fotos = fotos;

            //curtidas
            const curtidas = await knex('postagem_curtidas')
            .where({postagem_id: postagem.id})
            .select('usuario_id');
            postagem.curtidas = curtidas.length;

            // curtido por mim
            postagem.curtidoPorMim = curtidas.find(curtida => curtida.usuario_id === id) ? true : false;

            //comentarios
            const comentarios = await knex('postagem_comentarios')
            .leftJoin('usuarios', 'usuarios.id', 'postagem_comentarios.usuario_id')
            .where({postagem_id: postagem.id})
            .select('usuarios.username', 'postagem_comentarios.texto')
            postagem.comentarios = comentarios;
        }

        return res.status(200).json(postagens)
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    novaPostagem,
    curtir,
    comentar,
    feed,
    uploadFotos

}
const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize"); 
const Cliente = require('../model/cliente'); 
sequelize.sync();

//GET Retorna tarefas com paginação e ordenação
router.get('/', async (req, res) => {
    try {
        const carros = await sequelize.query(
            "SELECT carros.*, autores.nome AS autor, editoras.nome AS editora FROM carros JOIN autores ON carros.autor_id = autores.id JOIN editoras ON carros.editora_id = editoras.id ORDER BY carros.id DESC",
            { type: QueryTypes.SELECT }
        );
        res.status(200).json(carros);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* //GET Consulta uma tarefa pelo ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const [results, metadata] = await db.query(
            `SELECT * FROM tasks WHERE id = :id`,
            { 
                replacements: { id: req.params.id },
                type: db.QueryTypes.SELECT 
            }
        );
        if (results.length === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        } else {
            res.json({
                sucess: true,
                task: results, //tirei o [0] após results pois não aparecia o id lá no postman
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
}); */

 // Método POST para cadastrar um livro
router.post('/', async (req, res) => {
    const { modelo, preco, caracteristicas } = req.body;

    if (!modelo || !preco || !caracteristicas) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    try {
        await sequelize.query(
            "INSERT INTO carros (modelo, preco, caracteristicas) VALUES (?, ?, ?)",
            {
                replacements: [modelo, preco, caracteristicas],
                type: QueryTypes.INSERT
            }
        );
        res.status(201).json({ message: 'Carro criado com sucesso.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Filtro por título ou autor
router.get("/filtro/:palavra", async (req, res) => {
    const { palavra } = req.params;
    try {
        const carros = await sequelize.query(
            `SELECT carros.*, autores.nome AS autor, editoras.nome AS editora FROM carros JOIN autores ON carros.autor_id = autores.id JOIN editoras ON carros.editora_id = editoras.id WHERE carros.titulo LIKE ? OR autores.nome LIKE ?`,
            {
                replacements: [`%${palavra}%`, `%${palavra}%`],
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(carros);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//método PUT para atualizar um livro, o id indica o registro a ser alterado
router.put('/:id', async(req, res) => {
    const id = req.params.id; //pega o id enviado pela requisição
    const { preco } = req.body; //campo a ser alterado
    try{
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE carros SET preco = ? WHERE id = ?", { replacements: [preco, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Carro atualizado com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar um carro
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM carros WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Carro deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;
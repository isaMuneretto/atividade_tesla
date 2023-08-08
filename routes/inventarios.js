const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize"); 
const Carro = require('../model/carro'); 
sequelize.sync();

//GET Retorna tarefas com paginação e ordenação
router.get('/', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM carros ORDER BY updatedAt DESC LIMIT :limit OFFSET :offset`,
            { 
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            tasks: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//GET Consulta uma tarefa pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM carros WHERE id = :id`,
            { 
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT 
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
                task: results, 
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

 // Método POST para cadastrar um livro
 router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO carros (modelo, preco, caracteristicas, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;
        const replacements = [req.body.modelo, req.body.preco, req.body.caracteristicas, new Date(), new Date()];

        const [results, metadata] = await sequelize.query(query, { replacements });

        res.status(201).json({
            success: true,
            message: "Tarefa criada com sucesso",
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
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
const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize"); 
const Inventario = require('../model/inventario'); 
const Carro = require('../model/carro'); 
sequelize.sync();

//GET Mostrar o inventário junto com os detalhes do carro.
router.get('/', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT inventarios.*, carros.* FROM inventarios 
            INNER JOIN carros ON inventarios.carroId = carros.id
            ORDER BY inventarios.updatedAt DESC LIMIT :limit OFFSET :offset`,
            { 
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            inventarios: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//GET Consulta  pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM inventarios WHERE id = :id`,
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
                inventarios: results, 
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
        const query = `INSERT INTO inventarios ( quantidade, carroId, createdAt, updatedAt) VALUES (?, ?, ?, ?)`;
        const replacements = [req.body.quantidade, req.body.carroId, new Date(), new Date()];

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

//método PUT para atualizar um inventário, o id indica o registro a ser alterado
router.put('/:carroId', async(req, res) => {
    const carroId = req.params.carroId;
    const { quantidade } = req.body;

    try{
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE inventarios SET quantidade = ? WHERE carroId = ?", { replacements: [quantidade, carroId], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Quantidade do inventário atualizado com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar um carro
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM inventarios WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Inventário deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;
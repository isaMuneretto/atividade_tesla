const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize"); 
const Pedidos = require('../model/pedido'); 
const Cliente = require('../model/cliente');
const Carro = require('../model/carro');
sequelize.sync();

//GET Listar todos os pedidos junto com informações do cliente e detalhes do carro.
router.get('/', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT pedidos.*, clientes.*, carros.* FROM pedidos 
            INNER JOIN clientes ON pedidos.clienteId = clientes.id
            INNER JOIN carros ON pedidos.carroId = carros.id
            ORDER BY pedidos.updatedAt DESC LIMIT :limit OFFSET :offset`,
            { 
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            pedidos: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

// GET para encontrar todos os pedidos feitos por um cliente específico
router.get('/cliente/:clienteId', async (req, res) => {
    const clienteId = req.params.clienteId;

    try {
        const query = "SELECT * FROM pedidos WHERE clienteId = ?";
        const results = await sequelize.query(query, {
            replacements: [clienteId],
            type: QueryTypes.SELECT
        });

        res.json({
            success: true,
            pedidos: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//GET Consulta um pedido pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM pedidos WHERE id = ?`,
            { 
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT 
            }
        );
        if (results.length === 0){
            res.status(404).json({
                sucess: false,
                message:"pedido não encontrado",
            });
        } else {
            res.json({
                sucess: true,
                pedidos: results, 
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

router.get('/pedidos/total', async (req, res) => {
    try {
        const query = `
            SELECT 
                carros.modelo,
                COUNT(pedidos.carroId) AS total_vendas
            FROM 
                pedidos
                JOIN carros ON pedidos.carroId = carros.id
            GROUP BY
                carros.modelo
        `;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            total: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Rota para criar a visão
router.get('/visao/detalhesPedidos', async (req, res) => {
    try {
        const query = `SELECT pedidos.*, clientes.nome, clientes.email, carros.modelo, carros.preco
            FROM pedidos
            JOIN clientes ON pedidos.clienteId = clientes.id
            JOIN carros ON pedidos.carroId = carros.id`;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            detalhesPedidos: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

 // Método POST para cadastrar um livro
 router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO pedidos (clienteId, carroId, dataPedido, statusPedido, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.clienteId, req.body.carroId, req.body.dataPedido, req.body.statusPedido, new Date(), new Date()];

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

//tualizar o status de um pedido específico.
router.put('/:id', async(req, res) => {
    const id = req.params.id; //pega o id enviado pela requisição
    const { statusPedido } = req.body; //campo a ser alterado
    try{
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE pedidos SET statusPedido = ? WHERE id = ?", { replacements: [statusPedido, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Pedido atualizado com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar um carro
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM pedidos WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Carro deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;
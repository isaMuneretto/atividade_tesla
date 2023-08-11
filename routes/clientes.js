const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize"); 
const Cliente = require('../model/cliente'); 
const Pedidos = require('../model/pedido'); 
sequelize.sync();

//GET Retorna cliente com os pedidos com paginação e ordenação
 router.get('/', async (req, res) => {
    const {page = 1 , limit = 30} = req.query;
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT clientes.*, pedidos.statusPedido FROM clientes 
            INNER JOIN pedidos ON clientes.id = pedidos.clienteId
            ORDER BY clientes.updatedAt DESC LIMIT :limit OFFSET :offset`,
            { 
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            carros: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
}); 

// GET para listar todos os clientes
router.get('/todos', async (req, res) => {
    try {
        const query = "SELECT * FROM clientes";
        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            clientes: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//GET Consulta um cliente pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM clientes WHERE id = :id`,
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
                clientes: results, 
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

router.get('/cliente/clienteMaior', async (req, res) => {
    try {
        const query = `SELECT clienteId, COUNT(*) AS quantidade_carros_comprados
        FROM pedidos
        GROUP BY clienteId
        HAVING COUNT(*) = (
            SELECT MAX(total_carros)
            FROM (
                SELECT COUNT(*) AS total_carros
                FROM pedidos
                GROUP BY clienteId
            ) AS carros_por_cliente
        )`;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            clienteMaior: results,
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
        const query = `INSERT INTO clientes (nome, email, telefone, endereco, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.nome, req.body.email, req.body.telefone, req.body.endereco, new Date(), new Date()];

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
    const { telefone } = req.body; //campo a ser alterado
    try{
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE clientes SET telefone = ? WHERE id = ?", { replacements: [telefone, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Cliente atualizado com sucesso.' }); //statusCode indica ok no update
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

//Deletar um cliente que deseja ser removido do banco de dados.
router.delete('/:id', async(req, res) => {
    const {id} = req.params; //pega o id enviado pela requisição para ser excluído
    try{
        await sequelize.query("DELETE FROM clientes WHERE id = ?", { replacements: [id], type: QueryTypes.DELETE });
        res.status(200).json({ message: 'Cliente deletado com sucesso.' }); //statusCode indica ok no delete
    }catch(error){
        res.status(400).json({msg:error.message}); //retorna status de erro e mensagens
    }
});

module.exports = router;
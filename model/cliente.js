const db = require("../sequelize");
const Sequelize = require("sequelize");

const Cliente = db.define("cliente", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    endereco: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
});

Cliente.sync();

module.exports = Cliente;
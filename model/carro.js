const db = require("../sequelize");
const Sequelize = require("sequelize");

const Carro = db.define("carro", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    modelo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    caracteristicas: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Carro.sync();

module.exports = Carro;
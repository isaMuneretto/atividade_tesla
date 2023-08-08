const db = require("../sequelize");
const Sequelize = require("sequelize");
const Cliente = require("./cliente");
const Carro = require("./carro");

const Pedido = db.define("pedido", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clienteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    carroId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    dataPedido: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    statusPedido: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });
Pedido.belongsTo(Carro, { foreignKey: 'carroId' });

Pedido.sync();

module.exports = Pedido;
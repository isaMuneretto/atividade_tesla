const db = require("../sequelize");
const Sequelize = require("sequelize");
const Carro = require('./carro');

const Inventario = db.define('Inventario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    carroId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {});

Inventario.belongsTo(Carro, { foreignKey: 'carroId' });

module.exports = Inventario;

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
//const routes = require('./routes');
const PORT = 8081;
const carro = require('./routes/carros');
const cliente = require('./routes/clientes.js');
const inventario = require('./routes/inventarios.js');
const pedido = require('./routes/pedidos.js');

app.use(cors());
app.use(bodyParser.json());
//app.use(routes);

app.use('/carro', carro);
app.use('/cliente', cliente);
app.use('/inventario', inventario);
app.use('/pedido', pedido);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
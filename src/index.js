const express = require("express");
const rotas = require("./rotas");

const app = express();

app.use(express.json()); // As requisições virão no formato JSON.

app.use(rotas);

app.listen(3333);

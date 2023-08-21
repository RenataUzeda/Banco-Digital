const express = require("express");
const contasBancarias = require("./controladores/bancoDigital")

const rotas = express();

rotas.get("/contas", contasBancarias.listarContasBancarias)

module.exports = rotas;
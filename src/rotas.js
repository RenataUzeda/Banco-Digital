const express = require("express");
const {
  listarContasBancarias,
  criarContasBancarias,
  atualizarUsuario,
  excluirContaBancaria,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato
} = require("./controladores/bancoDigital");

const rotas = express();

rotas.get("/contas", listarContasBancarias);
rotas.post("/contas", criarContasBancarias);
rotas.put("/contas/:numeroConta/usuario", atualizarUsuario);
rotas.delete("/contas/:numeroConta", excluirContaBancaria);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", transferir);
rotas.get("/contas/saldo", saldo);
rotas.get("/contas/extrato", extrato);

module.exports = rotas;

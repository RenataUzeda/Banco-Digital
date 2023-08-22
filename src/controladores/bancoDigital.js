const { banco, contas, saques, depositos, transferencias } = require('../bancodedados'); 

const listarContasBancarias = (req, res) => {
  const senhaBanco = req.query.senha_banco;

  if (!senhaBanco) {
    return res
      .status(400)
      .json({ mensagem: "A senha do banco não foi informada!" });
  }

  if (senhaBanco !== banco.senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }

  return res.status(200).json(contas);
};

const criarContasBancarias = (req, res) => {  

}

const atualizarUsuario = (req, res) => {
   
}

const excluirContaBancaria = (req, res) => {
   
}

const depositar = (req, res) => {
   
}

const sacar = (req, res) => {
   
}

const transferir = (req, res) => {
   
}

const saldo = (req, res) => {
   
}

const extrato = (req, res) => {
   
}

module.exports = {
  listarContasBancarias,
  criarContasBancarias,
  atualizarUsuario,
  excluirContaBancaria,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato
};

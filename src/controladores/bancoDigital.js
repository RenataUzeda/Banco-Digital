const bancodedados = require('../bancodedados'); 

const listarContasBancarias = (req, res) => {
  const senhaBanco = req.query.senha_banco;

  if (!senhaBanco) {
    return res
      .status(400)
      .json({ mensagem: "A senha do banco não foi informada!" });
  }

  if (senhaBanco !== bancodedados.banco.senha) {
    return res
      .status(401)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }

  return res.status(200).json(bancodedados.contas);
};


module.exports = {
  listarContasBancarias,
};

const {
  banco,
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");

const validarCampos = require("../intermediarios");

let { idContaBancaria } = require("../bancodedados");

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
  const novaConta = req.body;

  const camposInvalidos = validarCampos(novaConta, contas, res);
  if (camposInvalidos) {
    return camposInvalidos;
  }

  const numeroConta = idContaBancaria;
  idContaBancaria++;

  const novaContaBancaria = {
    numero: numeroConta,
    saldo: 0,
    usuario: novaConta,
  };

  contas.push(novaContaBancaria);

  return res.status(201).json();
};

const atualizarUsuario = (req, res) => {
  const numeroConta = req.params.numeroConta;
  const dadosAtualizados = req.body;

  const conta = contas.find((conta) => conta.numero === Number(numeroConta));

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (dadosAtualizados.cpf === "") {
    return res
      .status(400)
      .json({ mensagem: "O campo de cpf não pode estar vazio!" });
  }

  if (
    contas.some(
      (c) => c.usuario.cpf === dadosAtualizados.cpf && c.numero !== numeroConta
    )
  ) {
    return res
      .status(400)
      .json({ mensagem: "O CPF informado já existe cadastrado!" });
  }

  if (dadosAtualizados.cpf && dadosAtualizados.cpf !== contas.cpf) {
    dadosAtualizados.cpf;
  } else {
    dadosAtualizados.cpf = conta.usuario.cpf;
  }

  if (dadosAtualizados.email === "") {
    return res
      .status(400)
      .json({ mensagem: "O campo de email não pode estar vazio!" });
  }

  if (
    contas.some(
      (c) =>
        c.usuario.email === dadosAtualizados.email && c.numero !== numeroConta
    )
  ) {
    return res
      .status(400)
      .json({ mensagem: "O email informado já existe cadastrado!" });
  }

  if (dadosAtualizados.email && dadosAtualizados.email !== contas.email) {
    dadosAtualizados.email;
  } else {
    dadosAtualizados.email = conta.usuario.email;
  }

  const camposObrigatorios = ["nome", "data_nascimento", "telefone", "senha"];

  for (const campo of camposObrigatorios) {
    if (!dadosAtualizados[campo]) {
      return res
        .status(400)
        .json({ mensagem: `O campo ${campo} é obrigatório!` });
    }
  }

  Object.assign(conta.usuario, dadosAtualizados);

  return res.status(204).json();
};

const excluirContaBancaria = (req, res) => {

  const numeroConta = req.params.numeroConta;

  // Verifica se o número da conta é válido 
  const conta = contas.find(conta => conta.numero === Number(numeroConta));
  if (!conta) {
    return res
      .status(404)
      .json({ mensagem: "Conta bancária não encontrada!" });
  }

  // Verifica se o saldo é zero
  if (conta.saldo !== 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  // Remove a conta do array de contas
  const removeConta = contas.indexOf(conta);
  contas.splice(removeConta, 1);

  return res.status(204).json();
};

const depositar = (req, res) => {};

const sacar = (req, res) => {};

const transferir = (req, res) => {};

const saldo = (req, res) => {};

const extrato = (req, res) => {};

module.exports = {
  listarContasBancarias,
  criarContasBancarias,
  atualizarUsuario,
  excluirContaBancaria,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
};

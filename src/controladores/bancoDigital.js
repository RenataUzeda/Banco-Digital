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

  const numeroConta = idContaBancaria.toString();
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

  const conta = contas.find((conta) => conta.numero === numeroConta);

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
  const conta = contas.find(conta => conta.numero === numeroConta);
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

const depositar = (req, res) => {
const { numero_conta, valor } = req.body;

// Verifica se o número da conta e o valor do depósito foram informados no body
if (!numero_conta || !valor) {
  return res
    .status(400)
    .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
}

// Verifica se a conta bancária informada existe
const conta = contas.find((c) => c.numero === numero_conta);
if (!conta) {
  return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
}

// Não permiti depósitos com valores negativos ou zerados
if (req.body.valor <= 0) {
  return res
    .status(400)
    .json({ mensagem: "O valor do depósito deve ser maior que zero!" });
}

// Soma o valor de depósito ao saldo da conta encontrada
conta.saldo += valor;

// Registra o depósito
const registroDeposito = {
  data: new Date().toISOString(),
  numero_conta,
  valor,
};
depositos.push(registroDeposito);

// Console.log(registroDeposito);

return res.status(204).json();

};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor || !senha) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" });
  }

  const conta = contas.find(conta => conta.numero === numero_conta);
  if (!conta) {
    return res
      .status(404)
      .json({ mensagem: "Conta bancária não encontrada!" });
  }

  // Verificar a senha
  if (conta.usuario.senha !== senha) {
    return res
      .status(401)
      .json({ mensagem: "Senha inválida!" });
  }

  // Verificar saldo disponível
  if (conta.saldo < valor) {
    return res
      .status(403)
      .json({ mensagem: "Saldo insuficiente para saque!" });
  }

  // Realizar o saque e atualizar saldo
  conta.saldo -= valor;

  // Registrar a transação de saque
  const registroSaque = {
    data: new Date().toISOString(),
    numero_conta,
    valor,
  };
  saques.push(registroSaque);

  // console.log(registroSaque);

  return res.status(204).json();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Número da conta de origem, número da conta de destino, valor e senha são obrigatórios!" });
  }

  const contaOrigem = contas.find(conta => conta.numero === numero_conta_origem);
  const contaDestino = contas.find(conta => conta.numero === numero_conta_destino);

  if (!contaOrigem) {
    return res
      .status(404)
      .json({ mensagem: "Conta de origem não encontrada!" });
  }

  if (!contaDestino) {
    return res
      .status(404)
      .json({ mensagem: "Conta de destino não encontrada!" });
  }

  // Verifica se a senha informada é válida para a conta de origem
  if (contaOrigem.usuario.senha !== senha) {
    return res
      .status(401)
      .json({ mensagem: "Senha incorreta para a conta de origem!" });
  }

  // Verifica se há saldo suficiente na conta de origem
  if (contaOrigem.saldo < valor) {
    return res
      .status(400)
      .json({ mensagem: "Saldo insuficiente!" });
  }

  // Realiza a transferência
  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  // Registra a transação
  const registroTransferencia = {
    data: new Date().toISOString(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  transferencias.push(registroTransferencia);

  //console.log(registroTransferencia);

  return res.status(204).json();
};

const saldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios!" });
  }

  const conta = contas.find(conta => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  return res.status(200).json({ saldo: conta.saldo });
};

const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios!" });
  }

  const conta = contas.find(conta => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  // Filtrar as transações relacionadas a essa conta
  const transacoesConta = {
    depositos: depositos.filter(transacao => transacao.numero_conta === numero_conta),
    saques: saques.filter(transacao => transacao.numero_conta === numero_conta),
    transferenciasEnviadas: transferencias.filter(transacao => transacao.numero_conta_origem === numero_conta),
    transferenciasRecebidas: transferencias.filter(transacao => transacao.numero_conta_destino === numero_conta),
  };

  return res.status(200).json(transacoesConta);
};

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

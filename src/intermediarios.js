const validarCampos = (novaConta, contas, res) => {
  const camposObrigatorios = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

  for (const campo of camposObrigatorios) {
    if (!novaConta[campo]) {
      return res
        .status(400)
        .json({ mensagem: `O campo ${campo} é obrigatório!` });
    }
  }
  const cpfExistente = contas.find(
    (conta) => conta.usuario.cpf === novaConta.cpf
  );

  if (cpfExistente) {
    return res.status(400).json({
      mensagem: `Já existe uma conta com o CPF informado: ${novaConta.cpf}.`,
    });
  }

  const emailExistente = contas.find(
    (conta) => conta.usuario.email === novaConta.email
  );
  if (emailExistente) {
    return res.status(400).json({
      mensagem: `Já existe uma conta com o email informado: ${novaConta.email}.`,
    });
  }

  return null; // Se todas as validações passarem, não há erro.
};

module.exports = validarCampos;

import Usuario from "../models/usuarioModel.js";

export const registrarUsuario = async (req, res) => {
  try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
          return res.status(400).json({ errors: validationErrors.array() });
      }

      const usuarioData = registerUserSchema.parse(req.body);

      const usuarioExistente = await usuario.findOne({ where: { email: usuarioData.email } });
      if (usuarioExistente) {
          return res.status(400).json({ message: 'E-mail já cadastrado' });
      }

      const hashSenha = await bcrypt.hash(usuarioData.senha, 10);

      const novoUsuario = await usuario.create({
          ...usuarioData,
          senha: hashSenha
      });

      return res.status(201).json({
          message: 'Usuário registrado com sucesso',
          usuario: novoUsuario
      });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(400).json(formatZodError(error));
      }
      return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};
export const loginUsuario = async (req, res) => {
  try {
      const usuarioData = loginUserSchema.parse(req.body);

      const usuarioExistente = await usuario.findOne({ where: { email: usuarioData.email } });
      if (!usuarioExistente) {
          return res.status(400).json({ message: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(usuarioData.senha, usuarioExistente.senha);
      if (!senhaValida) {
          return res.status(400).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
          { id: usuarioExistente.id, papel: usuarioExistente.papel },
          process.env.JWT_SECRET, // Definir JWT_SECRET nas variáveis de ambiente
          { expiresIn: '1h' }
      );

      return res.status(200).json({
          message: 'Login bem-sucedido',
          token
      });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(400).json(formatZodError(error));
      }
      return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};
export const listarUsuarios = async (req, res) => {
  try {
      const { nome, email, papel } = req.query;

      // Constrói a cláusula where usando operadores SQL padrão
      const whereClause = {};

      if (nome) whereClause.nome = `%${nome}%`; // Filtra pelo nome
      if (email) whereClause.email = `%${email}%`; // Filtra pelo email
      if (papel) whereClause.papel = papel; // Filtra pelo papel

      const usuarios = await usuario.findAll({
          where: whereClause
      });

      return res.status(200).json(usuarios);
  } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
  }
};
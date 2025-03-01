// import { Request, Response } from "express";
// import { AppDataSource } from "../data-source";
// import { User } from "../entities/User";
// import bcrypt from 'bcryptjs'


// class UserController {
//   private userRepository

//   constructor() {
//     this.userRepository = AppDataSource.getRepository(User);
//   }

//   create = async (req: Request, res: Response) => {
//     try {

//       const userBody = req.body 

//       if(!userBody || !userBody.name || !userBody.email || !userBody.profile || !userBody.password || !userBody.document ) {
//           res.status(400).json("Preencha todos os dados!")
//           return
//       }

//       const salt = await bcrypt.genSalt(10)
//       const senhaCriptografada = await bcrypt.hash(userBody.senha, salt)

//       userBody.senha = senhaCriptografada

//       await this.userRepository.save(userBody)
//       res.status(201).json(userBody)
//       return
//   } catch (ex) {
//       res.status(500).json("Não foi possível executar a solicitação!")
//   }
//   };
// }

// export default UserController;


import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { validate as isValidEmail } from "email-validator";
import { Branch } from "../entities/Branches";
import { Driver } from "../entities/Drivers";
import { In } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken"
import AppError from "../utils/AppError";
import SendEmail from "../utils/Send";

type dataJwt = JwtPayload & { userId: string; roles: string[] };


class UserController {
  private userRepository;
  private userDriverRepository;
  private userBranchRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.userBranchRepository = AppDataSource.getRepository(Branch);
    this.userDriverRepository = AppDataSource.getRepository(Driver);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { name, email, profile, password_hash, document, full_address } = req.body;

      // Validação de campos obrigatórios
      if (!name || !email || !profile || !password_hash || !document) {
        throw new AppError("Todos os campos obrigatórios devem ser preenchidos.", 400)
        // res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        // return
      }

      // Validação de email
      if (!isValidEmail(email)) {
        throw new AppError("Email inválido.", 400)
        // res.status(400).json({ error: "Email inválido." });
        // return
      }

      // Validação do profile
      const validProfiles = ["DRIVER", "BRANCH", "ADMIN"];
      if (!validProfiles.includes(profile)) {
        throw new AppError("Perfil inválido. Valores permitidos: DRIVER, BRANCH ou ADMIN.", 400)
        // res.status(400).json({ error: "Perfil inválido. Valores permitidos: DRIVER, BRANCH ou ADMIN." });
        // return
      }

      // Validação da senha
      if (password_hash.length < 6 || password_hash.length > 20) {
        throw new AppError("A senha deve ter entre 6 e 20 caracteres.", 400)
        // res.status(400).json({ error: "A senha deve ter entre 6 e 20 caracteres." });
        // return
      }

      // Validação do documento (CPF ou CNPJ)
      if (profile === "DRIVER" && !cpf.isValid(document) || profile === "ADMIN" && !cpf.isValid(document)) {
        throw new AppError("CPF inválido.", 400)
        // res.status(400).json({ error: "CPF inválido." });
        // return
      }

      if (profile === "BRANCH" && !cnpj.isValid(document)) {
        throw new AppError("CNPJ inválido.", 400)
        // res.status(400).json({ error: "CNPJ inválido." });
        // return
      }

      // Verifica se o email já existe no banco
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError("Email já cadastrado.", 400)
        // res.status(400).json({ error: "Email já cadastrado." });
        // return
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(password_hash, salt);

      // Criando usuário
      // Criando o usuário base primeiro
      const newUser = await this.userRepository.save({
        name,
        email,
        profile,
        password_hash: hashedPassword,
        document,
        full_address,
      });



      let createdProfile;

      // Agora usamos o usuário recém-criado para criar um Driver ou Branch
      if (profile === "DRIVER") {
        createdProfile = await this.userDriverRepository.save({
          name,
          document,
          full_address,
          user: newUser, // Associando corretamente o usuário
        });


      } else if (profile === "BRANCH") {
        createdProfile = await this.userBranchRepository.save({
          name,
          document,
          full_address,
          user: newUser, // Associando corretamente o usuário
        });


      }
      const sendMail = new SendEmail();
      await sendMail.sendUser(
        newUser.email, // O email do destinatário
        "Bem-vindo à nossa plataforma!", // O assunto do e-mail
        newUser.name // O nome do usuário
      );

      res.status(201).json(createdProfile || newUser)
      return

    } catch (error) {
      console.error(error);

      next(error)
      return
    }
  };


  listaUsuarios = async (req: Request, res: Response, next: NextFunction) => {

    try {
      let profileFilter = req.query.profile
      let users = []
      // Buscar todos os usuários da tabela User
      if (req.profile !== "ADMIN") {
        res.status(401).json({ message: "Somente usuário admim pode acessar a rota" })
      }
      if (profileFilter !== null) {
        users = await this.userRepository.find({
          where: {
            profile: profileFilter as "ADMIN" || "BRANCH" || "DRIVER"
          }
        });
      } else {
        users = await this.userRepository.find();
      }


      // Buscar todos os registros da tabela Branch
      const branches = await this.userBranchRepository.find();

      // Buscar todos os registros da tabela Driver
      const drivers = await this.userDriverRepository.find();

      // Combinar os resultados em um único array
      const combinedResults = [...users, ...branches, ...drivers];

      res.status(200).json(combinedResults);
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
  listUsarioId = async (req: Request, res: Response, next: NextFunction) => {


    try {

      const paramsid = Number(req.params.id)


      if (isNaN(paramsid)) {
        res.status(400).json({ message: "ID inválido" });
        return
      }

      if (req.profile === 'ADMIN') {
        const user = await this.userRepository.findOne({
          where: { id: Number(paramsid) },
        });
        res.status(200).json(user);
        return;
      }
      if (req.profile === "DRIVER") {
        if (paramsid !== Number(req.userId)) {
          res.status(403).json({ message: "Acesso negado" });
          return;
        }

        const user = await this.userRepository.findOne({
          where: { id: paramsid }, // Aqui busca pelo paramsid, mas só se for igual ao req.userId
        });

        if (!user) {
          res.status(404).json({ message: "Usuário não encontrado" });
          return;
        }

        res.status(200).json(user);
        return;
      }


      res.status(403).json({ message: "Acesso negado" }); // Se não for ADMIN ou DRIVER válido

    } catch (error) {
      console.log(error)
      next(error)
    }



  };


  updateUser = async (req: Request, res: Response, next: NextFunction) => {


    try {
      const { id } = req.params;
      const bodyUpdate = req.body;


      // Verificar se o ID do usuário é válido
      if (isNaN(Number(id))) {
        res.status(400).json({ message: "ID inválido" });
        return
      }

      // Verificar se o usuário existe
      const user = await this.userRepository.findOne({ where: { id: Number(id) } });
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return
      }

      // Bloquear campos proibidos na atualização
      const forbiddenFields = ["id", "created_at", "updated_at", "status", "profile"];
      for (const field of forbiddenFields) {
        if (bodyUpdate[field] !== undefined) {
          res.status(401).json({ message: `Campo '${field}' não pode ser atualizado` });
          return
        }
      }

      if (req.profile === "ADMIN") {
        const userUpdate: Partial<User> = {};
        const driverUpdate: Partial<Driver> = {};

        if (bodyUpdate.name) userUpdate.name = bodyUpdate.name;
        if (bodyUpdate.email) userUpdate.email = bodyUpdate.email;
        if (bodyUpdate.password_hash) userUpdate.password_hash = bodyUpdate.password_hash;

        await this.userRepository.update(id, userUpdate);

        // Verificar se o usuário sendo atualizado tem o perfil DRIVER
        if (user.profile === "DRIVER" && bodyUpdate.full_address) {
          driverUpdate.full_address = bodyUpdate.full_address;
          const driver = await this.userDriverRepository.findOne({ where: { user: { id: Number(id) } } });
          if (driver) {
            await this.userDriverRepository.update(driver.id, driverUpdate);
          }
          res.status(200).json({ message: "Usuário atualizado com sucesso!", userUpdate, driverUpdate, id });
          return
        }

        res.status(200).json({ message: "Usuário atualizado com sucesso!", userUpdate, id });
        return
      }

      if (req.profile === "DRIVER" && Number(req.userId) === Number(id)) {
        const driverUpdate: Partial<Driver> = {};
        const userUpdate: Partial<User> = {};

        if (bodyUpdate.name) userUpdate.name = bodyUpdate.name;
        if (bodyUpdate.email) userUpdate.email = bodyUpdate.email;
        if (bodyUpdate.password_hash) userUpdate.password_hash = bodyUpdate.password_hash;
        if (bodyUpdate.full_address) driverUpdate.full_address = bodyUpdate.full_address;

        await this.userRepository.update(id, userUpdate);

        if (Object.keys(driverUpdate).length > 0) {
          const driver = await this.userDriverRepository.findOne({ where: { user: { id: Number(id) } } });
          if (driver) {
            await this.userDriverRepository.update(driver.id, driverUpdate);
          }
        }

        res.status(200).json({ message: "Perfil atualizado com sucesso!", userUpdate, driverUpdate });
        return
      }

      res.status(403).json({ message: "Acesso negado" });
    } catch (error) {
      console.log(error)
      next(error)
    }

  }
  updateStatusUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verificar token de autorização

      // Verificar se o ID do usuário é válido
      if (isNaN(Number(id))) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      // Verificar se o usuário existe
      const user = await this.userRepository.findOne({ where: { id: Number(id) } });
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      // Bloquear campos proibidos na atualização
      const forbiddenFields = ["id", "created_at", "updated_at", "profile", "name", "password_hash", "email"];
      for (const field of forbiddenFields) {
        if (req.body[field] !== undefined) {
          res.status(401).json({ message: `Campo '${field}' não pode ser atualizado` });
          return;
        }
      }

      if (req.profile === "ADMIN") {
        user.status = status;
        await this.userRepository.save(user);
        res.status(200).json({
          message: "Status do usuário atualizado com sucesso!", user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            profile: user.profile,
            created_at: user.created_at,
            updated_at: user.updated_at
          }
        });
        return;
      }

      res.status(403).json({ message: "Acesso negado" });
    } catch (error) {
      console.log(error)
      next(error)

    }
  };

}
export default UserController;

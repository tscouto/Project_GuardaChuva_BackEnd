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

  create = async (req: Request, res: Response) => {
    try {

      const { name, email, profile, password_hash, document, full_address } = req.body;

      // Validação de campos obrigatórios
      if (!name || !email || !profile || !password_hash || !document) {
        res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        return
      }

      // Validação de email
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Email inválido." });
        return
      }

      // Validação do profile
      const validProfiles = ["DRIVER", "BRANCH", "ADMIN"];
      if (!validProfiles.includes(profile)) {
        res.status(400).json({ error: "Perfil inválido. Valores permitidos: DRIVER, BRANCH ou ADMIN." });
        return
      }

      // Validação da senha
      if (password_hash.length < 6 || password_hash.length > 20) {
        res.status(400).json({ error: "A senha deve ter entre 6 e 20 caracteres." });
        return
      }

      // Validação do documento (CPF ou CNPJ)
      if (profile === "DRIVER" && !cpf.isValid(document) || profile === "ADMIN" && !cpf.isValid(document)) {
        res.status(400).json({ error: "CPF inválido." });
        return
      }

      if (profile === "BRANCH" && !cnpj.isValid(document)) {
        res.status(400).json({ error: "CNPJ inválido." });
        return
      }

      // Verifica se o email já existe no banco
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: "Email já cadastrado." });
        return
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
      console.log(createdProfile, newUser)
      res.status(201).json(createdProfile || newUser)
      return


    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
      return
    }
  };


  listaUsuarios = async (req: Request, res: Response) => {

    try {
      let profileFilter = req.query.profile
      let users = []
      // Buscar todos os usuários da tabela User
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
    } catch (ex) {
      console.error(ex);
      res.status(500).send("Ocorreu um erro ao executar a solicitação");
    }
  }
  listUsarioId = async (req: Request, res: Response, next: NextFunction) => {


    try {

      const token = req.headers.authorization?.split(" ")[1]
      const paramsid = Number(req.params.id)

      if (!token) {
        res.status(401).json("Token inválido!");
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;


      if (isNaN(paramsid)) {
        res.status(400).json({ message: "ID inválido" });
        return
      }

      if (decoded.profile === 'ADMIN') {
        next();
        return;
      }
      if (decoded.profile === "DRIVER" && Number(decoded.userId) === paramsid) {
        // Busca SOMENTE o usuário com ID igual ao do token
        const user = await this.userRepository.findOne({
          where: { id: paramsid },
        });
  
        if (!user) {
          res.status(404).json({ message: "Usuário não encontrado" });
          return;
        }
  
        res.status(200).json(user); // Retorna os dados do próprio usuário
        return;
      }

      // if (decoded.profile === "DRIVER" && Number(decoded.id) === paramsid) {
      //   const user = await this.userRepository.findOne({
      //     where: { id: paramsid },
      //   });

      //   if (!user) {
      //     res.status(404).json({ message: "Usuário não encontrado" });
      //     return;
      //   }

      //   res.status(200).json(user); // Retorna os dados do usuário específico
      //   return;
      // }

      res.status(403).json({ message: "Acesso negado" }); // Se não for ADMIN ou DRIVER válido

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao processar requisição" });
    }
  };


}
export default UserController;

import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken"
import { User } from "../entities/User";
import bcrypt from "bcrypt"
import PayloadJwt from "../classes/PayloadJwt";
// import PayloadJwt from "../classes/PayloadJWT";

const authRouter = Router()

const userRepository = AppDataSource.getRepository(User)

authRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userBody = req.body

        const user = await userRepository.findOne({
            where: {
                email: userBody.email,
                password_hash: userBody.password
            }
        })

        if (!userBody.email || !userBody.password_hash) {
            res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
            return
        }

        if (!user) {
            res.status(401).json("Usuário e/ou senha incorreta!")
            return
        }

        const valido = await bcrypt.compare(userBody.password_hash, user.password_hash)

        const chaveSecretaJwt = process.env.JWT_SECRET ?? ""

        const payload = {
            email: user.email,
            name: user.name,
            userId: user.id,
            profile: user.profile
        } as PayloadJwt

        const token = await jwt.sign(payload, chaveSecretaJwt, { expiresIn: '1h' })

        if (valido) {
            res.status(200).json({ name: user.name, token: token })

            return
        } else {
            res.status(401).json("Usuário e/ou senha incorreta!")
            return
        }

    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

export default authRouter
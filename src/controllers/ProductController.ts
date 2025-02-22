import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import bcrypt from 'bcryptjs'
import { Branch } from "../entities/Branches";
import { Product } from "../entities/Products";
import jwt, { JwtPayload } from "jsonwebtoken";


require('dotenv').config()

type dataJwt = JwtPayload & { userId: string; roles: string[] };


class ProductController {
    // private branchRepository;
    private productRepository;

    constructor() {
        // this.branchRepository = AppDataSource.getRepository(Branch);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            console.log(req.body)
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                res.status(401).json("Token inválido!");
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;
            console.log("Decoded JWT:", decoded);

            const { name, amount, description, url_cover } = req.body;

            console.log("Tipo de 'amount':", typeof amount);  // Verifica o tipo de 'amount'


            // Validação de campos obrigatórios
            if (!name || !amount || !description) {
                res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
                return;
            }

            // Validação do tipo de 'amount' (ex: número maior que zero)
            if (typeof amount !== 'number' || amount <= 0) {
                res.status(400).json({ error: "'amount' deve ser um número positivo." });
                return;
            }


            // Verificar se o perfil do usuário é 'BRANCH'
            if (decoded.profile !== "BRANCH") {
                res.status(403).json({ error: "Acesso proibido. Apenas filiais podem cadastrar produtos." });
                return;
            }

            // Criar o produto associado à filial
            const createdProduct = await this.productRepository.save({
                name,
                amount,
                description,
                url_cover,
                branch_id: decoded.id
            });
            console.log(createdProduct)
            res.status(201).json({
                message: "Produto cadastrado com sucesso!",
                product: {
                    id: createdProduct.id,
                    name: createdProduct.name,
                    amount: createdProduct.amount,
                    description: createdProduct.description,
                    url_cover: createdProduct.url_cover
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
        }
    }
}

export default ProductController
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Products";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../config/winston";
import AppError from "../utils/AppError";
import { Branch } from "../entities/Branches";
// import { AuthRequest } from "../middlewares/auth";


type dataJwt = JwtPayload & { userId: number; };


class ProductController {
    private branchRepository;
    private productRepository;

    constructor() {
        // this.branchRepository = AppDataSource.getRepository(Branch);
        this.productRepository = AppDataSource.getRepository(Product);
        this.branchRepository = AppDataSource.getRepository(Branch);
    }

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {


            const { name, amount, description, url_cover } = req.body;



            const branch = await this.branchRepository.findOne({ where: { user_id: Number(req.userId) }, relations: ["user"] });

            if (!branch) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return
            }



            if (!name || !amount || !description) {
                res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
                return
            }

            if (amount <= 0) {
                res.status(400).json({ error: "'amount' deve ser um número positivo." });
                return
            }

            // Criando o produto
            const createdProduct = await this.productRepository.save({
                name,
                amount,
                description,
                url_cover,
                branch_id: branch.id
            });

            console.log("Created product:", createdProduct);

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
            return

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
            return
        }
    };
    listProduct = async (req: Request, res: Response) => {

        try {
            const listProducts = await this.productRepository.find({});

            if (listProducts.length === 0) {
                return res.status(404).json({ message: "Nenhum produto encontrado." });
            }

            return res.status(200).json(listProducts);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao processar requisição" });
        }
    }

}

export default ProductController
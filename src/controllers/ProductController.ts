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
                throw new AppError("Somente FILIAL pode cadastrar.", 404)
                // res.status(404).json({ message: "Somente FILIAL pode cadastrar" });
                // return
            }



            if (!name || !amount || !description) {
                throw new AppError("Todos os campos obrigatórios devem ser preenchidos.", 404)
                // res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
                // return
            }

            if (amount <= 0) {
                throw new AppError("amount' deve ser um número positivo.", 400)
                // res.status(400).json({ error: "'amount' deve ser um número positivo." });
                // return
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
            console.log(error)
            next(error)
        }
    };
    listProduct = async (req: Request, res: Response, next:NextFunction) => {

        try {


            if (req.profile !== "BRANCH") {
                throw new AppError("Somente usuário ADMIN pode acessar a rota", 401)
                // return res.status(401).json({ message: "Somente usuário ADMIN pode acessar a rota" });
            }

            // Busca todos os produtos
            const listProducts = await this.productRepository.find({});


            if (listProducts.length === 0) {
                throw new AppError("Nenhum produto encontrado.", 404)
                // return res.status(404).json({ message: "Nenhum produto encontrado." });
            }

            res.status(200).json(listProducts);
            return

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}

export default ProductController
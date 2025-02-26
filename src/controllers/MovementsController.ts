import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Branch } from "../entities/Branches";
import { Product } from "../entities/Products";
import { Movements } from "../entities/Movements";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../entities/User";


type dataJwt = JwtPayload & { userId: number; };

class MovementsController {
    private branchRepository
    private productRepository
    private movementsRepository
    private userRepository

    constructor() {
        this.branchRepository = AppDataSource.getRepository(Branch)
        this.productRepository = AppDataSource.getRepository(Product)
        this.movementsRepository = AppDataSource.getRepository(Movements)
        this.userRepository = AppDataSource.getRepository(User)
    }


    createMovements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_id, destination_branch_id, quantity } = req.body;

            // 🔹 Buscar a filial de origem baseada no usuário autenticado
            const branch = await this.branchRepository.findOne({
                where: { user_id: Number(req.userId) },
                relations: ["user"]
            });

            if (!branch) {
                return res.status(404).json({ message: "Filial de origem não encontrada" });
            }

            // 🔹 Verificar se há um motorista vinculado à filial
            //   const driver = await this.userRepository.findOne({
            //     where: { id: branch.user_id, profile: "DRIVER" }
            //   });

            //   if (!driver) {
            //     return res.status(400).json({ message: "Usuário responsável pela filial não é um motorista." });
            //   }

            // 🔹 Validação dos dados recebidos
            if (!product_id || !destination_branch_id || !quantity) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            if (quantity <= 0) {
                return res.status(400).json({ message: "A quantidade deve ser maior que zero" });
            }

            // 🔹 Verificar se a filial de destino existe
            const destinationBranch = await this.branchRepository.findOne({
                where: { id: Number(destination_branch_id) }
            });
            if (!destinationBranch) {
                return res.status(404).json({ message: "Filial de destino não encontrada" });
            }

            // 🔹 Verificar se a filial de origem e destino são diferentes
            if (Number(branch.id) === Number(destination_branch_id)) {
                return res.status(400).json({ message: "A filial de origem não pode ser a mesma que a filial de destino" });
            }

            // 🔹 Buscar o produto e verificar se pertence à filial de origem
            const product = await this.productRepository.findOne({
                where: { id: Number(product_id), branch_id: branch.id }
            });
            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado na filial de origem" });
            }

            // 🔹 Verificar se a quantidade solicitada está disponível
            if (product.amount < quantity) {
                return res.status(400).json({ message: "Estoque insuficiente para essa movimentação" });
            }

            // 🔹 Criar a movimentação com status PENDING
            const createMovements = await this.movementsRepository.save({
                destination_branch_id,
                product_id,
                quantity,
                status: "PENDING",
                driver_id: branch.id
            });

            // 🔹 Atualizar a quantidade do produto na filial de origem
            await this.productRepository.update(product.id, { amount: product.amount - quantity });

            return res.status(201).json({
                message: "Movimentação cadastrada com sucesso!",
                movement: {
                    id: createMovements.id,
                    destination_branch_id: createMovements.destination_branch_id,
                    product_id: createMovements.product_id,
                    name: product.name,
                    quantity: createMovements.quantity,
                    status: createMovements.status,
                    driver_id: createMovements.driver_id
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
        }
    };
    listMovements = async (req: Request, res: Response) => {
        try {
            const moviments = await this.movementsRepository.find({})
            res.status(200).json(moviments)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao processar requisição" });
        }

    }

    updateStatusMovements = async (req: Request, res: Response) => {
        try {
            type StatusType = "IN_PROGRESS";
            const status: StatusType = "IN_PROGRESS";

            const movementId = Number(req.params.id); // Pegando ID da movimentação
            if (!movementId) {
                return res.status(400).json({ message: "ID da movimentação é obrigatório" });
            }

            // 🔹 Buscar a movimentação
            const movement = await this.movementsRepository.findOne({ where: { id: movementId } });
            if (!movement) {
                return res.status(404).json({ message: "Movimentação não encontrada" });
            }

            if (movement.status === "IN_PROGRESS") {
                return res.status(404).json({ message: "Status da movimentação em IN_PROGRESS" });
            }

            // 🔹 Atualizar o status
            await this.movementsRepository.update(movementId, { status });



            // 🔹 Buscar novamente a movimentação para retornar os dados atualizados
            const updatedMovement = await this.movementsRepository.findOne({ where: { id: movementId }, relations: ["product"] });

            return res.status(200).json({
                id: updatedMovement?.id,
                destination_branch_id: updatedMovement?.destination_branch_id, // Corrigido
                product_id: updatedMovement?.product_id,
                name: updatedMovement?.product?.name ?? 'Produto não encontrado',
                quantity: updatedMovement?.quantity,
                status: updatedMovement?.status,
                created_at: updatedMovement?.created_at,
                updated_at: updatedMovement?.updated_at,
            });
        } catch (error) {
            console.error("Erro ao atualizar status da movimentação:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    };
    updateFinish = async (req: Request, res: Response) => {
        try {
            type StatusType = "FINISHED";
            const status: StatusType = "FINISHED";

            const movementId = Number(req.params.id);
            if (isNaN(movementId)) {
                return res.status(400).json({ message: "ID da movimentação é obrigatório e deve ser um número válido" });
            }

            // Buscar a movimentação
            const movement = await this.movementsRepository.findOne({
                where: { id: movementId },
                relations: ["product", "destinationBranch"]
            });

            if (!movement) {
                return res.status(404).json({ message: "Movimentação não encontrada" });
            }

            if (movement.status === "FINISHED") {
                return res.status(400).json({ error: "Movimentação já finalizada" });
            }

            if (movement.driver_id !== req.userId) {
                return res.status(403).json({ message: "Você não tem permissão para finalizar esta movimentação" });
            }

            // Atualizar o status
            await this.movementsRepository.update(movementId, { status });

            // Verifica se o produto já existe na filial de destino
            let existingProduct = await this.productRepository.findOne({
                where: {
                    description: movement.product.description,
                    branch_id: movement.destinationBranch.id
                }
            });

            if (existingProduct) {
                // Atualiza a quantidade do produto existente
                existingProduct.amount += movement.quantity;
                await this.productRepository.save(existingProduct);
            } else {
                // Cria um novo produto se não existir na filial
                const newProduct = this.productRepository.create({
                    amount: movement.quantity,
                    description: movement.product.description,
                    url_cover: movement.product.url_cover,
                    branch_id: movement.destinationBranch.id,
                });
                await this.productRepository.save(newProduct);
            }

            // Buscar novamente a movimentação para retornar os dados atualizados
            const updatedMovement = await this.movementsRepository.findOne({ where: { id: movementId } });

            return res.status(200).json({
                id: updatedMovement?.id,
                destination_branch_id: updatedMovement?.destination_branch_id,
                product_id: updatedMovement?.product_id,
                name: updatedMovement?.product.name,
                quantity: updatedMovement?.quantity,
                status: updatedMovement?.status,
                created_at: updatedMovement?.created_at,
                updated_at: updatedMovement?.updated_at,
            });
        } catch (error) {
            console.error("Erro ao atualizar status da movimentação:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}

export default MovementsController
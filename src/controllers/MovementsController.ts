import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Branch } from "../entities/Branches";
import { Product } from "../entities/Products";
import { Movements } from "../entities/Movements";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../entities/User";
import logger from "../config/winston";
import AppError from "../utils/AppError";
import SendEmail from "../utils/Send";


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
            if (req.profile !== "BRANCH") {
                throw new AppError("Somente usuário BRANCH pode acessar a rota", 401)
                // res.status(401).json({ message: "Somente usuário BRANCH pode acessar a rota" });
                // return;
            }

            const branch = await this.branchRepository.findOne({
                where: { user_id: Number(req.userId) },
                relations: ["user"]
            });

            if (!branch) {
                throw new AppError("Filial de origem não encontrada", 404)
                // res.status(404).json({ message: "Filial de origem não encontrada" });
                // return;
            }

            // 🔹 Validação dos dados recebidos
            if (!product_id || !destination_branch_id || !quantity) {
                throw new AppError("Todos os campos são obrigatórios", 400)
                // res.status(400).json({ message: "Todos os campos são obrigatórios" });
                // return;
            }

            if (quantity <= 0) {
                throw new AppError("A quantidade deve ser maior que zero", 400)
                // res.status(400).json({ message: "A quantidade deve ser maior que zero" });
                // return;
            }

            // 🔹 Verificar se a filial de destino existe
            const destinationBranch = await this.branchRepository.findOne({
                where: { id: Number(destination_branch_id) }
            });

            if (!destinationBranch) {
                throw new AppError("Filial de destino não encontrada", 404)
                // res.status(404).json({ message: "Filial de destino não encontrada" });
                // return;
            }

            // 🔹 Verificar se a filial de origem e destino são diferentes
            if (Number(branch.id) === Number(destination_branch_id)) {
                throw new AppError("A filial de origem não pode ser a mesma que a filial de destino", 400)
                // res.status(400).json({ message: "A filial de origem não pode ser a mesma que a filial de destino" });
                // return;
            }

            // 🔹 Buscar o produto e verificar se pertence à filial de origem
            const product = await this.productRepository.findOne({
                where: { id: Number(product_id), branch_id: branch.id }
            });

            if (!product) {
                throw new AppError("Produto não encontrado na filial de origem", 404)
                // res.status(404).json({ message: "Produto não encontrado na filial de origem" });
                // return;
            }

            // 🔹 Verificar se a quantidade solicitada está disponível
            if (product.amount < quantity) {
                throw new AppError("Estoque insuficiente para essa movimentação", 400)
                // res.status(400).json({ message: "Estoque insuficiente para essa movimentação" });
                // return;
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

            res.status(201).json({
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
            next(error); // 🔹 Encaminha o erro para o middleware de tratamento de erros
        }
    };
    listMovements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.profile || (req.profile !== "BRANCH" && req.profile !== "DRIVER")) {
                throw new AppError("Somente usuário BRANCH ou DRIVER pode acessar a rota", 401)
                // res.status(401).json({ message: "Somente usuário BRANCH ou DRIVER pode acessar a rota" });
                // return;
            }

            const userId = Number(req.userId);
            if (isNaN(userId)) {
                throw new AppError("ID do usuário inválido", 400)
                // res.status(400).json({ message: "ID do usuário inválido" });
                // return;
            }

            const branch = await this.branchRepository.findOne({ where: { id: userId } });
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!branch && !user) {
                throw new AppError("Usuário ou filial não encontrado", 404)
                // res.status(404).json({ message: "Usuário ou filial não encontrado" });
                // return;
            }

            const movements = await this.movementsRepository.find();
            res.status(200).json(movements); // ✅ Apenas chamar res.status().json()

        } catch (error) {
            console.log(error)
            next(error)
        }

    }

    updateStatusMovements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            type StatusType = "IN_PROGRESS";
            const status: StatusType = "IN_PROGRESS";

            if (req.profile !== "DRIVER") {
                throw new AppError("Somente usuário DRIVER pode acessar a rota", 401)
                // res.status(401).json({ message: "Somente usuário DRIVER pode acessar a rota" });
                // return;
            }

            const movementId = Number(req.params.id); // Pegando ID da movimentação
            if (!movementId) {
                throw new AppError("ID da movimentação é obrigatório", 400)
                // res.status(400).json({ message: "ID da movimentação é obrigatório" });
                // return;
            }

            // 🔹 Buscar a movimentação
            const movement = await this.movementsRepository.findOne({ where: { id: movementId } });

            if (!movement) {
                throw new AppError("Movimentação não encontrada", 404)
                // res.status(404).json({ message: "Movimentação não encontrada" });
                // return;
            }

            if (movement.status === "IN_PROGRESS") {
                throw new AppError("Status da movimentação já está IN_PROGRESS", 400)
                // res.status(400).json({ message: "Status da movimentação já está IN_PROGRESS" });
                // return;
            }

            if (movement.status === "FINISHED") {
                throw new AppError("Essa movimentação já está FINISHED", 400)
                // res.status(400).json({ message: "Essa movimentação já está FINISHED" });
                // return;
            }


            // 🔹 Atualizar o status
            await this.movementsRepository.update(movementId, { status });

            // 🔹 Buscar novamente a movimentação para retornar os dados atualizados
            const updatedMovement = await this.movementsRepository.findOne({ where: { id: movementId }, relations: ["product"] });

            const sendProduct = await this.movementsRepository.findOne({
                where: { id: movementId },
                relations: ["product", "driver", "destinationBranch", "destinationBranch.user"]
            });

            if (!sendProduct?.destinationBranch?.user?.email) {
                throw new AppError("Usuário responsável pela filial de destino não possui um e-mail cadastrado", 400);
            }

            // 🔹 Enviar o e-mail automaticamente para o responsável da filial destino
            const sendMail = new SendEmail();
            await sendMail.send(
                sendProduct.destinationBranch.user.email,
                "Produto saiu do local sentido à FILIAL DESTINATÁRIO",
                sendProduct.product.name,
                sendProduct.destinationBranch.user.name,
                "saindo" // Adicione o status aqui
            );
            // 🔹 Simulando o envio do e-mail, sem realmente enviar
            // const simulatedEmailResponse = {
            //     message: "Produto saiu agora do local sentido à FILIAL DESTINATÁRIO",
            //     productName: sendProduct.product.name,
            //     destinationBranch: sendProduct.destinationBranch.full_address,
            //     recipientEmail: sendProduct.destinationBranch.user.email  // Simulação de e-mail
            // };

            // Aqui, em vez de enviar o e-mail real, retornamos a simulação no JSON
            res.status(200).json({
                id: updatedMovement?.id,
                destination_branch_id: updatedMovement?.destination_branch_id,
                product_id: updatedMovement?.product_id,
                name: updatedMovement?.product?.name,
                quantity: updatedMovement?.quantity,
                status: updatedMovement?.status,
                created_at: updatedMovement?.created_at,
                updated_at: updatedMovement?.updated_at,
                // emailInfo: simulatedEmailResponse  // Informação simulada sobre o e-mail
            });

        } catch (error) {
            console.error(error);
            next(error); // 🔹 Encaminha o erro para o middleware de erro do Express
        }
    }




    updateFinish = async (req: Request, res: Response, next: NextFunction) => {
        try {
            type StatusType = "FINISHED";
            const status: StatusType = "FINISHED";

            const movementId = Number(req.params.id);
            if (isNaN(movementId)) {
                throw new AppError("ID da movimentação é obrigatório e deve ser um número válido", 400)
                // res.status(400).json({ message: "ID da movimentação é obrigatório e deve ser um número válido" });
                // return
            }

            // Buscar a movimentação
            const movement = await this.movementsRepository.findOne({
                where: { id: Number(movementId) },
                relations: ["product", "destinationBranch"]
            });

            console.log(movement)

            if (!movement) {
                throw new AppError("Movimentação não encontrada", 404)
                // res.status(404).json({ message: "Movimentação não encontrada" });
                // return
            }

            if (movement.status === "FINISHED") {
                throw new AppError("Movimentação já finalizada", 400)
                // res.status(400).json({ error: "Movimentação já finalizada" });
                // return
            }

            if (movement.driver_id !== req.userId) {
                throw new AppError("Você não tem permissão para finalizar esta movimentação", 403)
                // res.status(403).json({ message: "Você não tem permissão para finalizar esta movimentação" });
                // return
            }

            // Atualizar o status
            await this.movementsRepository.update(movementId, { status });


            // Verifica se o produto já existe na filial de destino
            let existingProduct = await this.productRepository.findOne({
                where: {
                    id: movement.product.id,
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
                    name: movement.product.name,
                    url_cover: movement.product.url_cover,
                    branch_id: movement.destinationBranch.id,
                });
                await this.productRepository.save(newProduct);
            }

            // Buscar novamente a movimentação para retornar os dados atualizados
            const showUpdate = await this.movementsRepository.findOne({ where: { id: Number(movement.id) }, relations: ["product"] })
            const sendProduct = await this.movementsRepository.findOne({
                where: { id: movementId },
                relations: ["product", "driver", "destinationBranch", "destinationBranch.user"]
            });

            if (!sendProduct?.destinationBranch?.user?.email) {
                throw new AppError("Usuário responsável pela filial de destino não possui um e-mail cadastrado", 400);
            }


            // 🔹 Enviar o e-mail automaticamente para o responsável da filial destino
            const sendMail = new SendEmail();
            await sendMail.send(
                sendProduct.destinationBranch.user.email,
                "Produto saiu do local sentido à FILIAL DESTINATÁRIO",
                sendProduct.product.name,
                sendProduct.destinationBranch.user.name,
                "chegou" // Adicione o status aqui
            );

            // const simulatedEmailResponse = {
            //     message: "Produto CHEGOU na FILIAL DESTINATARIO",
            //     productName: sendProduct.product.name,
            //     destinationBranch: sendProduct.destinationBranch.full_address,
            //     recipientEmail: sendProduct.destinationBranch.user.email  // Simulação de e-mail
            // };

            // const response = {
            //     ...showUpdate,  // Inclui todos os dados de showUpdate
            //     emailInfo: simulatedEmailResponse  // Adiciona as informações do e-mail simulado
            // };

            res.status(200).json(showUpdate)
            return

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default MovementsController
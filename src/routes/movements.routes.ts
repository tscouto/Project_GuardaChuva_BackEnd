import { Router } from "express"
import verifyToken from "../middlewares/auth";
import MovementsController from "../controllers/MovementsController";
import { Request, Response, NextFunction } from "express";
import verifyTokenEnabled from "../middlewares/verifyTokenEnabled";

const movementsRouter = Router();

const movementsControler = new MovementsController()



movementsRouter.post("/", verifyTokenEnabled, movementsControler.createMovements)
movementsRouter.get("/", verifyTokenEnabled, movementsControler.listMovements)

movementsRouter.patch("/status/:id", verifyTokenEnabled, movementsControler.updateStatusMovements)

movementsRouter.patch("/end/:id", verifyTokenEnabled, movementsControler.updateFinish)
export default movementsRouter;
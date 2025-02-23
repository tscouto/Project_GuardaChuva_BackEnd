import { Router } from "express"
import verifyToken from "../middlewares/auth";
import MovementsController from "../controllers/MovementsController";
import { Request, Response, NextFunction } from "express";

const movementsRouter = Router();

const movementsControler = new MovementsController()


//@ts-ignore
movementsRouter.post("/", (req, res, next) => verifyToken(["BRANCH"], req, res, next), movementsControler.createMovements)


export default movementsRouter;
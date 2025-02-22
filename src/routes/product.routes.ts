import { Router } from "express";

import ProductController from "../controllers/ProductController";
import verifyToken from "../middlewares/auth";

const productRouter = Router();

const productControler = new ProductController()


productRouter.post("/", (req, res, next) => verifyToken(["BRANCH"], req, res, next), productControler.createProduct)


export default productRouter;
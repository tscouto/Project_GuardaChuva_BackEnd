import { Router } from "express";

import ProductController from "../controllers/ProductController";
import verifyToken from "../middlewares/auth";
import verifyTokenEnabled from "../middlewares/verifyTokenEnabled";

const productRouter = Router();

const productControler = new ProductController()


productRouter.post("/", verifyTokenEnabled, productControler.createProduct)
//@ts-ignore
productRouter.get("/", verifyTokenEnabled, productControler.listProduct)

export default productRouter;
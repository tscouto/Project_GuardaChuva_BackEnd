import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../middlewares/auth";
import authRouter from "./auth.routes";
const userRouter = Router();

const userController = new UserController();

userRouter.post("/",userController.create);
userRouter.post("/",authRouter )
export default userRouter;

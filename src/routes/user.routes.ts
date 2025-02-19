// import { Router } from "express";
// import UserController from "../controllers/UserController";
// import authRouter from "./auth.routes";
// import { verifyToken } from "../middlewares/auth";
// const userRouter = Router();

// const userController = new UserController();

// userRouter.post("/",userController.create);
// userRouter.post("/", authRouter)
// userRouter.get("/", verifyToken(['ADMIN']), userController.listaUsuarios);
// export default userRouter;
import { Router } from "express";
import UserController from "../controllers/UserController";
import authRouter from "./auth.routes";
import { verifyToken, AuthRequest } from "../middlewares/auth";
const userRouter = Router();

const userController = new UserController();

userRouter.post("/", userController.create);
userRouter.use("/auth", authRouter); // Alterado de .post para .use
userRouter.get("/", (req, res, next) => verifyToken(['ADMIN'], req as AuthRequest, res, next), userController.listaUsuarios);
export default userRouter;
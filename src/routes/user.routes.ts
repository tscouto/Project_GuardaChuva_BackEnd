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
import verifyToken from "../middlewares/auth";
import verifyTokenEnabled from "../middlewares/verifyTokenEnabled";


const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.create);
userRouter.post("/login", authRouter); // Alterado de .post para .use
userRouter.get("/", verifyTokenEnabled, userController.listaUsuarios);

userRouter.get("/:id", verifyTokenEnabled, userController.listUsarioId);
userRouter.put("/:id", verifyTokenEnabled, userController.updateUser);
userRouter.patch("/status/:id", verifyTokenEnabled, userController.updateStatusUsuario)


export default userRouter;
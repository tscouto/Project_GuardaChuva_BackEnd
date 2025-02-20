// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import AppError from "../utils/AppError";
// import { User } from "../entities/User";

// type dataJwt = JwtPayload & { userId: string };

// export interface AuthRequest extends Request {
//   userId: string;
// }
// export
// const verifyToken = ( listaPermissoes: string [], req: Request & { userId: string },_res: Response, next: NextFunction) => {
//   // try {
//   //   const token = req.headers.authorization?.split(" ")[1] ?? "";

//   //   if (!token) {
//   //     throw new AppError("Token não informado", 401);
//   //   }

//   //   const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt

//   //   req.userId = data.userId

//   //   next();

//   try {
//     const token = req.headers.authorization?.split(" ")[1] ?? ""

//     if(!token){
//       _res.status(401).json("Token inválido!")
//         return
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt

//     const roles = JSON.parse(payload.roles)

//     let hasPermission = false;

//     roles.map((r: User) => {
//         if(r.profile == "ADMIN"){
//             hasPermission = true;
//             return
//         }
//         r.profile.find((p: User) => {
//           if(listaPermissoes.includes(p.profile)){
//               hasPermission = true;
//           }
//       })
//     })

//     if(!hasPermission){
//         _res.status(401).json({message: "Usuário não possui autorização para acessar este recurso!"})
//         return
//     }
//     next()
//   } catch (error) {
//     if (error instanceof Error) {
//       next(new AppError(error.message, 401));
//     } else {
//       next(new AppError("Unknown error", 401));
//     }
//   }
// };

// export default verifyToken;


import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { User } from "../entities/User";

type dataJwt = JwtPayload & { userId: string; roles: string[] };

export interface AuthRequest extends Request {
  userId: string;
}

export const verifyToken = (listaPermissoes: string[], req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    
    if (!token) {
      res.status(401).json("Token inválido!");
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    const profile = payload.profile;

    let hasPermission = false;

    if (listaPermissoes.includes(profile) ) {
      hasPermission = true;
    } 


    if (!hasPermission) {
      res.status(401).json({ message: "Usuário não possui autorização para acessar este recurso!" });
      return;
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError("Unknown error", 401));
    }
  }
};

export default verifyToken;



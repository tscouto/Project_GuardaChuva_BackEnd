import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";

type dataJwt = JwtPayload & { userId: string; roles: string[] };


export const verifyTokenEnabled = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Request body in verifyToken middleware:", req.body);
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      res.status(401).json("Token inválido!");
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    req.userId = Number(payload.userId);
    req.profile = payload.profile

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError("Unknown error", 401));
    }
  }
};

export default verifyTokenEnabled;
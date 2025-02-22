import { Product } from "../entities/Products";

declare global {
    namespace Express {
        interface Request {
            userId?: number,
            profile?:string
        }
    }
}
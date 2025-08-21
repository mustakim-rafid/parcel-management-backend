import { JwtPayload } from "jsonwebtoken";
import { Role } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}
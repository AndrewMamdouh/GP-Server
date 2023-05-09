import { verifyToken } from "../utils/jwt.js";
import errorHandler from "./errorHandler.js";
import { errorEnum } from "../constants/errorCodes.js";

export default function authHandler(req, res, next){
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) return errorHandler(errorEnum.AUTH_REQUIRED, req, res, next)

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  const result = verifyToken(bearerToken, "ACCESS");

  if (result instanceof Error) return errorHandler(errorEnum.INVALID_AUTH, req, res, next);
  req.user = result;

  next();
};

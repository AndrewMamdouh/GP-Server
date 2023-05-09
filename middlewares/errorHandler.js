import { errorEnum, errorCodes } from "../constants/errorCodes.js";

export default function errorHandler(errCode, req, res, next) {
  const error = errorCodes[errCode] || errorCodes[errorEnum.INTERNAL_ERROR];
  console.log('lolllllllll');
  res.status(error.statusCode).json({ message: error.message });
  next();
}

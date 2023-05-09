import { errorEnum, errorCodes } from "../constants/errorCodes.js";

export default function errorHandler(err, req, res, next) {
  console.log(err);
  const error = errorCodes[err] || errorCodes[errorEnum.INTERNAL_ERROR];
  res.status(error.statusCode).json({ message: err instanceof Error ? err.message : error.message });
  next();
}

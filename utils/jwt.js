import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const { sign, verify } = jwt;
const { ACCESS_JWT_KEY, REFRESH_JWT_KEY } = process.env;

const getTokenKey = (tokenType) =>
  tokenType === "ACCESS" ? ACCESS_JWT_KEY : REFRESH_JWT_KEY;

const getTokenExpiry = (tokenType) =>
  tokenType === "ACCESS" ? 60 * 60 : 60 * 60 * 2;

export function createToken(body, tokenType) {
  const key = getTokenKey(tokenType);
  const token = sign(body, key, { expiresIn: getTokenExpiry(tokenType) });
  return token;
}

export function verifyToken(token, tokenType) {
  const key = getTokenKey(tokenType);
  return verify(token, key, (err, body) => err ? err : body);
}

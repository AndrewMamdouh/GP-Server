import Transporter from "../constants/Transponder.js";
import CreateResetPasswordEmailTemplate from "./CreateResetPasswordEmailTemplate.js";
import { createToken } from "../utils/jwt.js";
import * as dotenv from "dotenv";
import { tokenTypes } from "../constants/jwt.js";

dotenv.config();

const { PORT, MAIL_SERVICE_NAME } = process.env;

const SendResetPasswordEmail = async (name, email) => {
  
  // Generate JWT
  const token = createToken({ email }, tokenTypes.PUBLIC);
  
  // Generate verification email
  const resetLink = `http://localhost:${PORT}/api/v1/users/reset?token=${token}`;

  const mailOptions = {
    from: MAIL_SERVICE_NAME,
    to: email,
    subject: 'Reset your password',
    text: `Please click on the following link to reset your password: ${resetLink}`,
    html: CreateResetPasswordEmailTemplate(name, resetLink)
  };

  await Transporter.sendMail(mailOptions);
}

export default SendResetPasswordEmail;
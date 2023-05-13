import Transporter from "../constants/Transponder.js";
import CreateVerificationEmailTemplate from "./CreateVerificationEmailTemplate.js";
import { createToken } from "../utils/jwt.js";
import * as dotenv from "dotenv";
import { tokenTypes } from "../constants/jwt.js";

dotenv.config();

const { PORT, MAIL_SERVICE_NAME } = process.env;

const SendVerificationEmail = async (email) => {
  
  // Generate JWT
  const token = createToken({ email }, tokenTypes.PUBLIC);
  
  // Generate verification email
  const verificationLink = `http://localhost:${PORT}/api/v1/users/verify?token=${token}`;

  const mailOptions = {
    from: MAIL_SERVICE_NAME,
    to: email,
    subject: 'Verify your email address',
    text: `Please click on the following link to verify your email address: ${verificationLink}`,
    html: CreateVerificationEmailTemplate(verificationLink)
  };

  await Transporter.sendMail(mailOptions);
}

export default SendVerificationEmail;
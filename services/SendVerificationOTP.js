import Transporter from "../constants/Transponder.js";
import CreateVerificationEmailTemplate from "./CreateVerificationEmailTemplate.js";
import { createToken } from "../utils/jwt.js";
import * as dotenv from "dotenv";
import { tokenTypes } from "../constants/jwt.js";

dotenv.config();

const { MAIL_SERVICE_NAME } = process.env;

const SendVerificationEmail = async (email) => {

  const mailOptions = {
    from: MAIL_SERVICE_NAME,
    to: email,
    subject: 'Verify your email address',
    text: `Here is : ${verificationLink}`,
    html: CreateVerificationEmailTemplate(verificationLink)
  };

  await Transporter.sendMail(mailOptions);
}

export default SendVerificationEmail;
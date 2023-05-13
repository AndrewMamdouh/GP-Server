import { hashSync } from "bcrypt";
import { userData } from "../constants/userData.js";
import userDataValidator from "../utils/userDataValidator.js";

const {
  USERNAME,
  FULLNAME,
  EMAIL,
  PASSWORD
} = userData;

const CreateUserInfoService = ({ username, fullName, email, password }) => {

  userDataValidator(USERNAME, username);
  userDataValidator(FULLNAME, fullName);
  userDataValidator(EMAIL, email);
  userDataValidator(PASSWORD, password);

  // hash plain password
  const hashPass = hashSync(password, 15);

  return {
    username,
    fullName,
    email: email.toLowerCase(),
    password: hashPass,
  };
};

export default CreateUserInfoService;

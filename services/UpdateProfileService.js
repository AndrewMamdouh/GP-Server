import { userTypes } from "../constants/models.js";
import { userData } from "../constants/userData.js";
import userDataValidator from "../utils/userDataValidator.js";

const {
  USERNAME,
  FULLNAME,
  PHONE_NUM,
  HOURLY_RATE,
  DESCRIPTION,
} = userData;

const UpdateProfileService = ({ username, fullName, phoneNum, hourlyRate, description }, userType) => {
 
  username && userDataValidator(USERNAME, username);
  fullName && userDataValidator(FULLNAME, fullName);

  if (userType === userTypes.FREELANCER) {
    phoneNum && userDataValidator(PHONE_NUM, phoneNum);
    hourlyRate && userDataValidator(HOURLY_RATE, hourlyRate);
    description && userDataValidator(DESCRIPTION, description);
  }
};

export default UpdateProfileService;

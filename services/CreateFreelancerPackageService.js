import { freelancerPackageData } from "../constants/userData.js";
import freelancerPackageDataValidator from "../utils/freelancerPackageDataValidator.js";

const {
  PHOTOS_NUM,
  DESCRIPTION,
} = freelancerPackageData;

const CreateFreelancerPackageService = ({
  photosNum,
  description,
}) => {

  freelancerPackageDataValidator(PHOTOS_NUM, photosNum);
  freelancerPackageDataValidator(DESCRIPTION, description);
  
  return {
    photosNum,
    description,
  };
};

export default CreateFreelancerPackageService;

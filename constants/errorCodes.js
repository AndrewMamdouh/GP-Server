import { freelancerType } from "./freelancer.js";

export const errorEnum = {
  ALL_FIELDS_REQUIRED: 'ALL_FIELDS_REQUIRED',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  USERNAME_EXIST: 'USERNAME_EXIST',
  EMAIL_EXIST: 'EMAIL_EXIST',
  INVALID_USERNAME: 'INVALID_USERNAME',
  INVALID_FULLNAME: 'INVALID_FULLNAME',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_FREELANCER_TYPE: 'INVALID_FREELANCER_TYPE',
  INVALID_LOCATION: 'INVALID_LOCATION',
  INVALID_HOURLY_RATE: 'INVALID_HOURLY_RATE',
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_BIO: 'INVALID_BIO',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_AUTH: 'INVALID_AUTH',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  LOCATION_API_ERROR: 'LOCATION_API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
}

export const httpResponseCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const errorCodes = {
  [errorEnum.ALL_FIELDS_REQUIRED]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "All fields are required.",
  },
  
  [errorEnum.AUTH_REQUIRED]: {
    statusCode: httpResponseCodes.UNAUTHORIZED,
    message: "Authorization credentials are required.",
  },

  [errorEnum.USERNAME_EXIST]: {
    statusCode: httpResponseCodes.CONFLICT,
    message: "Username already exists.",
  },

  [errorEnum.EMAIL_EXIST]: {
    statusCode: httpResponseCodes.CONFLICT,
    message: "Email address already exists.",
  },

  [errorEnum.INVALID_USERNAME]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Username length must be between 8 to 20. Username must only contain alphanumeric characters, underscore and dot. Underscore and dot can't be at the end or the start or next to each other. Underscore or dot can't be used multiple times in a row.",
  },

  [errorEnum.INVALID_FULLNAME]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Full name must be at most 3 words each 4 or more characters.",
  },

  [errorEnum.INVALID_EMAIL]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Invalid email address.",
  },

  [errorEnum.INVALID_PASSWORD]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, 1 special character and be 8 characters or longer.",
  },

  [errorEnum.INVALID_FREELANCER_TYPE]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: `Type should be one of these: ${Object.values(freelancerType).join(', ')}`,
  },

  [errorEnum.INVALID_LOCATION]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Address must be an array of two numeric values [latitude, longitude].",
  },

  [errorEnum.INVALID_HOURLY_RATE]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Hourly rate must be a number [10, 1000].",
  },

  [errorEnum.INVALID_PHONE]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Mobile number must be in one of the following formats: {0-10-xxxx-xxxx, 0-11-xxxx-xxxx, 0-12-xxxx-xxxx, 0-15-xxxx-xxxx}.",
  },

  [errorEnum.INVALID_BIO]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Description must be at least 20 characters and not exceeding 1000 characters.",
  },

  [errorEnum.INVALID_CREDENTIALS]: {
    statusCode: httpResponseCodes.BAD_REQUEST,
    message: "Invalid credentials.",
  },

  [errorEnum.INVALID_AUTH]: {
    statusCode: httpResponseCodes.UNAUTHORIZED,
    message: "Invalid authorization.",
  },

  [errorEnum.EMAIL_NOT_FOUND]: {
    statusCode: httpResponseCodes.NOT_FOUND,
    message: "This email address isn't registered.",
  },

  [errorEnum.WRONG_PASSWORD]: {
    statusCode: httpResponseCodes.UNAUTHORIZED,
    message: "Password is incorrect.",
  },

  [errorEnum.LOCATION_API_ERROR]: {
    statusCode: httpResponseCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong in reverse geocoding API.",
  },

  [errorEnum.INTERNAL_ERROR]: {
    statusCode: httpResponseCodes.INTERNAL_SERVER_ERROR,
    message: "Internal server error.",
  },
};

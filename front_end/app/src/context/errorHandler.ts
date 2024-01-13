import axios, { AxiosError } from "axios";
import { defaultErrorData } from "./ErrorContext";
import { IErrorData } from "./ErrorContext";

enum HttpStatusCodes {
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNKNOWN_ERROR = 520,
}

export function errorHandler(error: Error | AxiosError): IErrorData {
  let errorData: IErrorData = defaultErrorData;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
	  errorData = error.response.data as IErrorData;
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
      errorData.error = "HTTP request failure";
      errorData.message = "Request made but no response received.";
      errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
    errorData.error = "Error setting up the HTTP request";
    errorData.message = error.message;
    errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
  }

  return errorData;
}

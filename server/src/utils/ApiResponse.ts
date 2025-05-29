class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  success: boolean;
  constructor(statusCode: number, message: string = "Success", data: T) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //success true if statusCode is lessthan 400
  }
}

export {ApiResponse}
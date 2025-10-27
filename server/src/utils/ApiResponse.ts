export class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T | null;
  success: boolean;
  errors?: any[];

  constructor(
    statusCode: number,
    message: string = "Success",
    data?: T | null,
    errors?: any[]
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.success = statusCode < 400;
  }
}

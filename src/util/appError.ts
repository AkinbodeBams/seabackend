export class AppError extends Error {
  statusCode: number;
  status: string;
  constructor(message: string | undefined, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

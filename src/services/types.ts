export interface CustomError {
  statusCode: number;
  message: {
    message: string;
    error: string;
    statusCode: number;
  };
}

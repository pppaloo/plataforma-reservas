class ApiError extends Error {
  constructor(status, message, code = 'ERROR', details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.expose = status < 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

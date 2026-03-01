class AppError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, statusText) {
    this.message = message;
    this.statusCode = this.statusCode;
    this.statusText = this.statusText;
    return this;
  }
}

module.exports = new AppError();

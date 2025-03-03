/**
 * @class NotFoundError
 * @extends Error
 * @description Error class for not found errors
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

/**
 * @class BadRequestError
 * @extends Error
 * @description Error class for bad request errors
 */
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

/**
 * @class UnauthorizedError
 * @extends Error
 * @description Error class for unauthorized errors
 */
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

/**
 * @class ForbiddenError
 * @extends Error
 * @description Error class for forbidden errors
 */
export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

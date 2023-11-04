export class AppError extends Error {
  type: string;
  status: number;

  constructor(message: string, type: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @apiDefine ValidationError
 * @apiError BadRequest The input request data are invalid.
 * @apiErrorExample {json} BadRequest
 *    HTTP/1.1 400 BadRequest
 *    {
 *      "type": "BAD_REQUEST",
 *      "message": "Invalid or missing request data."
 *    }
 */
export class ValidationError extends AppError {
  errors: any[]; // Declare the errors property

  constructor(message?: string, errors?: any[]) {
    super(message || 'Invalid or missing request data.', 'BAD_REQUEST', 400);
    // @ts-expect-error
    this.errors = errors;
  }
}

/**
 * @apiDefine NotFoundError
 * @apiError NotFound Requested resource not found.
 * @apiErrorExample {json} NotFound
 *    HTTP/1.1 404 NotFound
 *    {
 *      "type": "NOT_FOUND",
 *      "message": "Resource not found."
 *    }
 */
export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Resource not found.', 'NOT_FOUND', 404);
  }
}

/**
 * @apiDefine UnauthorizedError
 * @apiError Unauthorized Server denied access to requested resource.
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "type": "UNAUTHORIZED",
 *      "message": "Site access denied."
 *    }
 */
export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || 'Site access denied.', 'UNAUTHORIZED', 401);
  }
}

/**
 * @apiDefine IdleTimeoutError
 * @apiError IdleTimeout Server denied access to requested resource.
 * @apiErrorExample {json} IdleTimeout
 *    HTTP/1.1 401 IdleTimeout
 *    {
 *      "type": "IDLE_TIMEOUT",
 *      "message": "Site access denied."
 *    }
 */
export class IdleTimeoutError extends AppError {
  constructor(message?: string) {
    super(message || 'Site access denied.', 'IDLE_TIMEOUT', 401);
  }
}

/**
 * @apiDefine ConflictError
 * @apiError Conflict The request could not be completed due to a conflict with the current state of the resource.
 * @apiErrorExample {json} Conflict
 *    HTTP/1.1 409 Conflict
 *    {
 *      "type": "CONFLICT",
 *      "message": "The request could not be completed due to a conflict with the current state of the resource."
 *    }
 */
export class ConflictError extends AppError {
  constructor(message?: string) {
    super(
      message || 'The request could not be completed due to a conflict with the current state of the resource.',
      'CONFLICT',
      409
    );
  }
}

/**
 * @apiDefine InternalServerError
 * @apiError (Error 5xx) InternalServerError Something went wrong.
 * @apiErrorExample {json} InternalServerError
 *    HTTP/1.1 500 InternalServerError
 *    {
 *      "type": "INTERNAL_SERVER",
 *      "message": "Something went wrong. Please try again later or contact support."
 *    }
 */
export class InternalServerError extends AppError {
  constructor(message?: string) {
    super(message || 'Something went wrong. Please try again later or contact support.', 'INTERNAL_SERVER', 500);
  }
}

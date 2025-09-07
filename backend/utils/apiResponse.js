/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in the response
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} error - Error object or additional error data
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message || error;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Validation error response handler
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {string} message - Error message
 */
const validationError = (res, errors, message = 'Validation failed') => {
  res.status(400).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Not found response handler
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  res.status(404).json({
    success: false,
    message,
  });
};

/**
 * Unauthorized response handler
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Forbidden response handler
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  res.status(403).json({
    success: false,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};

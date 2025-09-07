const jwt = require('jsonwebtoken');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/apiResponse');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authenticate = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return unauthorizedResponse(res, 'No token, authorization denied');
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return unauthorizedResponse(res, 'Token is not valid');
  }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return forbiddenResponse(res, 'Admin access required');
  }
};

/**
 * Middleware to check if user is the owner of the resource or admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === req.params.userId)) {
    next();
  } else {
    return forbiddenResponse(res, 'Not authorized to access this resource');
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isOwnerOrAdmin,
};

import jwt from "jsonwebtoken";

// Models
import User from "../models/userModel.js";

// Config
import { redisClient } from "../config/redis.js";

/**
 * @function isAuthorized
 * @access private
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const isAuthorized = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.error("No token provided. Authorization denied", 401);
    }
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    const userId = isValid.id;

    // Check Redis session
    const userSession = await redisClient.hGetAll(`session:users:${userId}`);
    if (!userSession || Object.keys(userSession).length === 0) {
      throw new Error(`No active session found for user ${userId}`);
    }

    // Check if the token is valid
    if (token !== userSession.token) {
      throw new Error(`Invalid session token for user ${userId}`);
    }

    // Check if user exists in MongoDB
    const registeredUser = await User.findById(userId).select("+email");
    if (!registeredUser) {
      throw new Error(`User not found for user ${userId}`);
    }

    // Attach user data to request
    req.user = {
      ...userSession,
      email: registeredUser.email,
      name: registeredUser.name,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.error(error.message ?? `User not authorized`, 401, error);
  }
};

export default isAuthorized;

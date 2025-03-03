// Packages
import jwt from "jsonwebtoken";

// Models
import User from "../models/userModel.js";

// Config
import { redisClient } from "../config/redis.js";

// Utils
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errorUtils.js";

// Crypt
import { passCrypt } from "../utils/authUtils.js";

/**
 * @function generateToken
 * @description Generate a JWT token for a user
 * @param {string} userId - The ID of the user
 * @returns {string} - The JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * @function login
 * @async
 * @description Login a user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @throws {Error} - If the user is not found or the password is invalid.
 * @returns {Promise<Object>}
 */
const login = async (email, password) => {
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  try {
    const user = await User.findOne({ email })
      .select("+password +email")
      .lean();

    // check if user exists
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const userId = user._id.toString();

    // check if password is valid
    const isValid = passCrypt.verify(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Invalid password");
    }

    // generate token
    const token = generateToken(userId);

    // cache user
    const sessionData = {
      _id: userId,
      name: user.name,
      email: user.email,
      token,
    };

    await redisClient.hSet(`session:users:${userId}`, sessionData);
    await redisClient.expire(`session:users:${userId}`, 2592000); // 30 days in seconds

    console.log(await redisClient.hGetAll(`session:users:${userId}`));

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @function logout
 * @async
 * @description Logout a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>}
 */
const logout = async (userId) => {
  await redisClient.del(`session:users:${userId}`);
};

export default {
  login,
  logout,
};

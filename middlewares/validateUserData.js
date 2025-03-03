// Errors
import { BadRequestError } from "../utils/errorUtils.js";

/**
 * @function validateUserData
 * @description Validate the user data
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 */

const validateUserData = (req, res, next) => {
  try {
    const { email } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      throw new BadRequestError("Invalid email format");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateUserData;

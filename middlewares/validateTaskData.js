// Errors
import { BadRequestError } from "../utils/errorUtils.js";

/**
 * @function validateTaskData
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
const validateTaskData = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  if (!title || !description || !status || !priority || !dueDate) {
    throw new BadRequestError("All fields are required");
  }
  req.body.dueDate = new Date(dueDate);

  next();
};

export default validateTaskData;

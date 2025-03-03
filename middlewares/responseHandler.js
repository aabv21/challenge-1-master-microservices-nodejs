import { logger } from "./logger.js";

const responseHandler = (req, res, next) => {
  // Override success response method
  res.success = (message = "Operation successful", statusCode = 200, data) => {
    const response = { success: true, data, message };

    logger.info(`${req.method} ${req.originalUrl} ${statusCode}`, {
      userId: req.user?._id,
      data: response,
    });

    return res.status(statusCode).json(response);
  };

  // Override error response method
  res.error = (message = "Operation failed", statusCode = 500, error) => {
    const response = { success: false, message, error };

    logger.error(`${req.method} ${req.originalUrl} ${statusCode}`, {
      userId: req.user?._id,
      error: response,
    });

    return res.status(statusCode).json(response);
  };

  next();
};

export default responseHandler;

import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  // 1. Log the system exception (Checklist: "Log all system exceptions")
  logger.error(err.stack);

  // 2. Determine status code (Default to 500 if unknown)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // 3. Send GENERIC response to user (Checklist: "Do not disclose sensitive information")
  res.status(statusCode).json({
    message: "Something went wrong. Please try again later.", // Generic message
    // Only show stack trace if we are in development mode
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
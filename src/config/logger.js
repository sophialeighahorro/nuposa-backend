import winston from "winston";

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    // 1. Write all logs to console (so you see them while coding)
    new winston.transports.Console(),
    // 2. Write errors to a specific file (Checklist: "Ensure mechanism exists to conduct log analysis")
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // 3. Write everything else to a combined file
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
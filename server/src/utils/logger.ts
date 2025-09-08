// utils/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",  // minimum level to log (info, warn, error, debug, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()  // e.g. "info: Server started"
  ),
  transports: [
    new winston.transports.Console(),  // logs go to the console
    // You can also add file transports:
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

export default logger;

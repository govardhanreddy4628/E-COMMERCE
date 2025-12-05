// utils/logger.ts
import path from "path";
import winston from "winston";

// Create global logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

/**
 * Extract filename + line number from stack trace.
 */
function getCallerLocation() {
  const err = new Error();
  const stack = err.stack?.split("\n") || [];

  /**
   * Example stack line we want:
   * at <anonymous> (C:\project\src\utils\sendEmail.ts:23:13)
   */
  const callerLine = stack[3] || "";

  // Match: (full/path/file.ts:23:13)
  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);

  if (match) {
    const fullPath = match[1];
    const line = match[2];
    const file = path.basename(fullPath);
    return `${file}:${line}`;
  }

  return "unknown";
}

type ConsoleMethod = "log" | "error" | "warn" | "info";
const methods: ConsoleMethod[] = ["log", "error", "warn", "info"];

methods.forEach((method) => {
  const original = console[method].bind(console);

  console[method] = (...args: any[]) => {
    const location = getCallerLocation();

    const msg = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
      .join(" ");

    logger.log({
      level: method === "log" ? "info" : method,
      message: `[${location}] ${msg}`,
    });

    // Optional: keep original console output visible
    // original(...args);
  };
});

export default logger;

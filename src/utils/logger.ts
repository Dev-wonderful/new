import * as winston from "winston";
import "winston-daily-rotate-file";
import appRoot from "app-root-path";
import config from "../config";

const { format } = winston;
const transports = [];

const formats = format.combine(
  // format.label({ label: 'right meow!' }),
  format.timestamp(),
  format.printf(
    (info) =>
      `[${info.level.toUpperCase()}]: ${info.timestamp} - ${info.message} ${info.label || ""}`,
  ),
  format.colorize({
    colors: { info: "blue", error: "red", warn: "yellow" },
    all: true,
  }),
);

const productionTransport = new winston.transports.DailyRotateFile({
  filename: "application-%DATE%.log",
  dirname: `${appRoot}/logs/`,
  level: "info",
  handleExceptions: true,
  json: false,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const developmentTransport = new winston.transports.Console({
  level: "debug",
});

if (config.NODE_ENV !== "production") {
  transports.push(developmentTransport);
} else {
  transports.push(productionTransport);
}
// transports.push(productionTransport);

const logger = winston.createLogger({
  format: formats,
  transports: transports,
  exitOnError: false,
});

// logger.stream = {
// 	write(message) {
// 		logger.info(message);
// 	}
// };

export default logger;

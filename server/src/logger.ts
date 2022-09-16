import winston from "winston";
import expressWinston from "express-winston";

const level = process.env.LOG_LEVEL || "debug";
const silent = process.env.NODE_ENV === "test";

const winstonInstance = winston.createLogger({
	defaultMeta: { service: "QuizBuilder" },
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.printf((info) => {
			const msg = info.stack || info.message;
			return `${info.level} ${info.timestamp} : ${msg}`;
		})
	),
	transports: [
		new winston.transports.Console({
			handleExceptions: true,
			level,
			silent,
		}),
	],
	exitOnError: false,
});

const loggerOptions = {
	winstonInstance,
};

export const appLogger = expressWinston.logger(loggerOptions);
export const errorLogger = expressWinston.errorLogger(loggerOptions);

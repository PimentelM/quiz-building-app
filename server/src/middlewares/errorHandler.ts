import express from "express";
import {config} from "../config";

export const getErrorHandlingMiddleware = () => {
	return (error: Error & any, req: express.Request, res: express.Response, next: express.NextFunction) => {
		let statusCode = 500;
		let errorName = "Internal Server Error";
		let message = "Please, contact admnistrators if this error persists";

		if(error.__isApplicationError) {
			statusCode = error.httpStatuscode;
			errorName = error.name;
			message = error.message;
		}

		if(error.name === "SyntaxError" && error.message.includes("JSON")) {
			statusCode = 400;
			message = error.message;
			errorName = error.name;
		}

		let response = {
			error: errorName,
			message,
		}

		if(config.env !== "production") {
			response["_error"] = {
				message: error.message,
				stack: error.stack,
				name: error.name
			}
		}

		res.status(statusCode).send(response);

		next(error);
	};
}
import express from "express";

export const getErrorHandlingMiddleware = () => {
	return (error: Error & any, req: express.Request, res: express.Response, next: express.NextFunction) => {
		let statusCode = 500;
		let message = "Internal Server Error";
		let description = "An unexpected error occurred";

		if(error.__isApplicationError) {
			statusCode = error.httpStatuscode;
			description = error.description;
			message = error.message;
		}

		res.status(statusCode).send({
			message,
			description,
		});

		next(error);
	};
}
import express from "express";

export const getErrorHandlingMiddleware = () => {
	return (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

		res.status(500).send({
			message: "Server Internal Error",
			details: error.message,
		});

		next(error);
	};
}
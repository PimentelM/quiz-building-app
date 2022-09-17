import {Request,Response, NextFunction} from "express";
import {config} from "../config";
import jwt from "jsonwebtoken";
import {getRequestContext} from "./requestScopedContextStorage";

export function requireAuth(req: Request, res: Response, next: NextFunction){
	if(req.headers.authorization && config.env === "test") {
		next();
		return;
	}

	// Handle authorization header and
	if(req.headers.authorization) {
		let token = req.headers.authorization.split(" ")[1];
		if(token) {
			jwt.verify(token, config.jwtSecret, (err, decoded) => {
				if(err){
					return res.status(401).send({
						message: "Unauthorized - Invalid token"
					});
				}
				let {id} = decoded as any;
				getRequestContext().userId = id;
				next();
			})
			return;
		}

	}

	res.status(401).send({
		message: "Unauthorized"
	});
}
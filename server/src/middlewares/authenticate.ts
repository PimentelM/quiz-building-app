import {Request,Response, NextFunction} from "express";
import {config} from "../config";

export function requireAuth(req: Request, res: Response, next: NextFunction){
	if(req.headers.authorization && config.env === "test") {
		next();
		return;
	}

	// TODO: Add authentication logic here.
	if(req.headers.authorization) {
		next();
		return;
	}

	res.status(403);
	res.send("Not Authorized");
}
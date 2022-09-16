import {Request,Response, NextFunction} from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction){
	if(req.headers.token){
		next();
		return;
	}

	res.status(403);
	res.send("Not Authorized");
}
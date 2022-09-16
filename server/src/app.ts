import "reflect-metadata";
import express from "express";
import { appLogger, errorLogger } from "./logger";
import cors from "cors";
import helmet from "helmet";
import router from "./utils/controllerRouter"
import {getErrorHandlingMiddleware} from "./middlewares/errorHandler";

export function getApp(){
	const app = express();

	app.use(express.json());
	app.use(cors());
	app.use(helmet());
	app.use(appLogger);


	// Add Auth0 middleware here


	// Register Routes from Controllers metadata
	router(app, "/api");

	// Error Handling
	app.use(getErrorHandlingMiddleware());

	app.use(errorLogger);

	app.use((req,res)=>{
		res.status(404).send("Not Found");
	});

	return app;
}


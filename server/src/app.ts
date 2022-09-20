/* eslint-disable @typescript-eslint/no-namespace */
import "reflect-metadata";
import "./services/mailSender"
import express from "express";
import { appLogger, errorLogger } from "./logger";
import cors from "cors";
import helmet from "helmet";
import router from "./router"
import {getErrorHandlingMiddleware} from "./middlewares/errorHandler";
import {requestScopedContextMiddleware} from "./middlewares/requestScopedContextStorage";
import controllers from "./controllers";

export function getApp(){
	const app = express();

	app.use(express.json());
	app.use(cors());
	app.use(helmet());
	app.use(appLogger);

	// Request scoped context storage middleware
	app.use(requestScopedContextMiddleware);

	// Register Routes from Controllers metadata
	router(app, "/api", controllers);

	// Error Handling
	app.use(getErrorHandlingMiddleware());

	app.use(errorLogger);

	app.use((req,res)=>{
		res.status(404).send("Not Found");
	});

	return app;
}


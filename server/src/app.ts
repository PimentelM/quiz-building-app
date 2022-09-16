import express from "express";
import { appLogger, errorLogger } from "./logger";
import router from "./router";

const app = express();

app.use(express.json());
app.use(appLogger);
app.use(router);
app.use(errorLogger);

app.use((req,res)=>{
	res.status(404).send("Not Found");
});

export default app;

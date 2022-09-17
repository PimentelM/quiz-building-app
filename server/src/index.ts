import * as dotenv from "dotenv"

dotenv.config();
import {config} from "./config";
import {getApp} from "./app";
import {initDatabase} from "./database";

initDatabase().then(() => {
	console.log("Starting application...")
	getApp().listen(config.port, () => {
		console.log(`App is running on port ${config.port}`)
	})
})

import * as dotenv from "dotenv"
dotenv.config();
import {config} from "./config";
import {getApp} from "./app";
import {initDatabase} from "./database";
import Container from "typedi";
import {MailSender} from "./services/mailSender";

// Init dependencies
Container.set("mailSenderService", new MailSender());

initDatabase().then(() => {
	console.log("Starting application...")
	getApp().listen(config.port, () => {
		console.log(`App is running on port ${config.port}`)
	})
})

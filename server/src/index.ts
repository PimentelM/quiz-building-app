import * as dotenv from "dotenv"
dotenv.config();
import { config } from "./config";
import {getApp} from "./app";

console.log(config);
getApp().listen(config.port, () => {
	console.log(`App is running on port ${config.port}`)
})

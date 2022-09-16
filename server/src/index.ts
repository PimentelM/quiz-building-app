import { config } from "./config";
import app from "./app";

console.log(config);
app.listen(config.port, () => {
	console.log(`App is running on port ${config.port}`)
})

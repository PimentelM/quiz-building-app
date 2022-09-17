
enum NodeEnv {
    TEST = "test",
    DEV = "development",
    PROD = "production",
}

interface AuthConfig {
	domain: string;
	clientId: string;
	audience: string;
}

interface Config {
    env: NodeEnv;
    port: number;
	databaseConnectionString: string;
	auth: AuthConfig
	jwtSecret: string;
	frontendUrl: string;
}

export const config: Config = {
	env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
	databaseConnectionString: process.env.DATABASE_CONNECTION_STRING || "",
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
	auth: {
		domain: process.env.AUTH0_DOMAIN || "",
		clientId: process.env.AUTH0_CLIENT_ID || "",
		audience: process.env.AUTH0_AUDIENCE || "",
	},
	jwtSecret: process.env.JWT_SECRET || "",
	frontendUrl: process.env.FRONTEND_URL || ""

}

export function validateConfig(){
	if(config.env !== NodeEnv.TEST) {
		if(!config.databaseConnectionString) throw new Error("DATABASE_CONNECTION_STRING not specified.")
		if(!config.jwtSecret) throw new Error("JWT_SECRET not specified.")
	}
}


validateConfig();

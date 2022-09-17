
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
}

export const config: Config = {
	env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
	databaseConnectionString: process.env.DATABASE_CONNECTION_STRING || "",
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
	auth: {
		domain: process.env.AUTH0_DOMAIN || "",
		clientId: process.env.AUTH0_CLIENT_ID || "",
		audience: process.env.AUTH0_AUDIENCE || "",
	}

}

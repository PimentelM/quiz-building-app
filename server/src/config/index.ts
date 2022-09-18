import nodemailer from "nodemailer";

enum NodeEnv {
    TEST = "test",
    DEV = "development",
    PROD = "production",
}

interface MailerConfig {
	smtpHost: string;
	smtpPort: number;
	isSecure: boolean;
	user: string;
	pass: string;
	from: string;
}

interface Config {
    env: NodeEnv;
    port: number;
	databaseConnectionString: string;
	jwtSecret: string;
	frontendUrl: string;
	mailerConfig: MailerConfig;
}

export const config: Config = {
	env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
	databaseConnectionString: process.env.DATABASE_CONNECTION_STRING || "",
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
	jwtSecret: process.env.JWT_SECRET || "",
	frontendUrl: process.env.FRONTEND_URL || "",
	mailerConfig: {
		smtpHost: process.env.SMTP_HOST || "",
		smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 0,
		isSecure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : false,
		user: process.env.SMTP_USER || "",
		pass: process.env.SMTP_PASS || "",
		from: process.env.MAIL_FROM || "",
	}


}

export function validateConfig(){
	if(config.env !== NodeEnv.TEST) {
		if(!config.databaseConnectionString) throw new Error("DATABASE_CONNECTION_STRING not specified.")
		if(!config.jwtSecret) throw new Error("JWT_SECRET not specified.")
		if(!config.mailerConfig.smtpHost) throw new Error("SMTP_HOST not specified.")
		if(!config.mailerConfig.smtpPort) throw new Error("SMTP_PORT not specified.")
		if(!config.mailerConfig.user) throw new Error("SMTP_USER not specified.")
		if(!config.mailerConfig.pass) throw new Error("SMTP_PASS not specified.")
		if(!config.mailerConfig.from) throw new Error("MAIL_FROM not specified.")
	}
}


validateConfig();

import {IAuthMailSender} from "./authService";
import nodemailer from "nodemailer";
import {config} from "../config";

export class AuthMailSender implements IAuthMailSender {

	private transporter : nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: config.mailerConfig.smtpHost,
			port: config.mailerConfig.smtpPort,
			secure: config.mailerConfig.isSecure,
			auth: {
				user: config.mailerConfig.user,
				pass: config.mailerConfig.pass
			}
		});
	}

	async sendSimpleMail(to: string, subject: string, text: string, html?: string): Promise<void> {
		let message = {
			from: config.mailerConfig.from,
			to,
			subject,
			text,
			html
		};

		await this.transporter.sendMail(message).then(info=>{
			console.log(`Message sent: ${info.messageId}`)
		})
	}

	sendActivationMail(to: string, token: string): Promise<void> {
		return this.sendSimpleMail(
			to,
			"Activate your account",
			`Please, access the following link to activate your account: ${config.frontendUrl}/activate-account?token=${token}`
		);
	}

	sendPasswordResetMail(to: string, token: string): Promise<void> {
		return this.sendSimpleMail(to,
			"Reset your password",
			`Please, access the following link to reset your password: ${config.frontendUrl}/reset-password?token=${token}`
		);
	}
}
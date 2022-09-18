import {ISimpleMailSender} from "./authService";
import nodemailer from "nodemailer";
import {config} from "../config";

export class MailSender implements ISimpleMailSender {

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
}
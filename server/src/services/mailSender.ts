import {Injectable} from "../utils/architecturalDecorators";

export interface IMailSenderService {
	sendMail(to: string, subject: string, text: string): Promise<void>
}

@Injectable("mailSenderService")
export class MailSender implements IMailSenderService {
	async sendMail(to: string, subject: string, text: string): Promise<void> {
		console.log(`Sending mail to ${to}...`);
		console.log({
			to,
			subject,
			text
		})
	}
}
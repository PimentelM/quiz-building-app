import {ISimpleMailSender} from "./authService";


export class MailSender implements ISimpleMailSender {
	async sendSimpleMail(to: string, subject: string, text: string): Promise<void> {
		console.log(`Sending mail to ${to}...`);
		console.log({
			to,
			subject,
			text
		})
	}
}
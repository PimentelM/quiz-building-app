import Container from "typedi";
import {ISimpleMailSender} from "../services/authService";

export function injectTestDependencies() {
	let mockMailService : ISimpleMailSender= {
		sendSimpleMail: jest.fn( )
	}
	Container.set("mailSenderService", mockMailService);
}
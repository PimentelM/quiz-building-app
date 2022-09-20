import Container from "typedi";
import {IAuthMailSender} from "../services/authService";

export function injectTestDependencies() {
	let mockMailService : IAuthMailSender= {
		sendActivationMail: jest.fn(()=>Promise.resolve()),
		sendPasswordResetMail: jest.fn(()=>Promise.resolve())
	}

	Container.set("authMailSenderService", mockMailService);
}
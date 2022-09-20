import {Injectable} from "../utils/architecturalDecorators";
import bcrypt from "bcryptjs";
import {InvalidInputError} from "../utils/applicationErrorClasses";
import jwt from "jsonwebtoken";
import {config} from "../config";
import {Inject} from "typedi";
import {timeout} from "../utils/javascriptUtils";
import {getUniqueId} from "../utils/uniqueIdGenerator";
import {UserRepository} from "../repositories/user";

let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export interface ISimpleMailSender {
	sendSimpleMail(to: string, subject: string, text: string, html?: string): Promise<void>
}


@Injectable()
export class AuthService {

	constructor(private userRepository : UserRepository,
		@Inject("mailSenderService") private mailSenderService: ISimpleMailSender) {
	}


	public async login(email: string, password: string) {
		email = email.toLowerCase();

		let user = await this.userRepository.findByEmail(email)

		if(!user) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		if(user.isInactive) {
			throw new InvalidInputError("Account is inactive, please check your e-mail");
		}

		if(!bcrypt.compareSync(password, user.password)) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		// Create token
		let payload = {
			id: user._id,
			email: user.email
		};

		let token = jwt.sign(payload, config.jwtSecret, {expiresIn: "1d"});

		return token;
	}

	public async register(email: string, password: string) {
		// Test email format using regex
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}

		email = email.toLowerCase();

		let emailAlreadyInUse = await this.userRepository.findByEmail(email);

		if(emailAlreadyInUse) {
			throw new InvalidInputError("Email already in use.");
		}

		if(!password || password.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(password, 10);

		let user = await this.userRepository.save({
			_id: getUniqueId(),
			email, password: hashedPassword, isInactive: true
		});

		delete (user as any).password

		// Only throws error after function returns...
		// await for test purposes... /* in a real system we would use pub sub to send the email */
		await Promise.race([this.sendUserActivationEmail(email).catch(err=>{
			setTimeout(()=> {throw err}, 0);
		}), timeout(100)])

		return user;

	}

	async sendUserActivationEmail(email: string) {
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}
		email = email.toLowerCase();

		let user = await this.userRepository.findByEmail(email);
		if(!user) {
			throw new InvalidInputError("Email not found");
		}

		let token = jwt.sign({
			type: "activateUser",
			email
		}, config.jwtSecret, {expiresIn: "1h"});

		let emailBody = `Please, access the following link to activate your account: ${config.frontendUrl}/activate-account?token=${token}`;

		await this.mailSenderService.sendSimpleMail(
			email,
			"Quiz Builder - Activate your account",
			emailBody
		);
	}

	async activateAccount(token: string) {
		let decodedToken;

		try {
			decodedToken = jwt.verify(token, config.jwtSecret) as {type: string, email: string};
		} catch (e) {
			throw new InvalidInputError("Invalid token");
		}

		if(decodedToken.type !== "activateUser") {
			throw new InvalidInputError("Invalid token");
		}

		let user = await this.userRepository.findByEmail(decodedToken.email);

		if(!user) {
			throw new InvalidInputError("Invalid token");
		}

		await this.userRepository.activateAccount(user.email);
	}

	async sendResetPasswordEmail(email: string) {
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}
		email = email.toLowerCase();

		let user = await this.userRepository.findByEmail(email);
		if(!user) {
			throw new InvalidInputError("Email not found");
		}

		let token = jwt.sign({
			type: "resetPassword",
			email
		}, config.jwtSecret, {expiresIn: "1h"});

		let emailBody = `Please, access the following link to reset your password: ${config.frontendUrl}/reset-password?token=${token}`;

		await this.mailSenderService.sendSimpleMail(
			email,
			"Quiz Builder - Reset password Link",
			emailBody
		);

	}

	async resetPassword(token: string, password: string) {
		let decodedToken;

		try {
			decodedToken = jwt.verify(token, config.jwtSecret) as {type: string, email: string};
		} catch (e) {
			throw new InvalidInputError("Invalid token");
		}

		if(decodedToken.type !== "resetPassword") {
			throw new InvalidInputError("Invalid token");
		}

		let user = await this.userRepository.findByEmail(decodedToken.email);

		if(!user) {
			throw new InvalidInputError("Invalid token");
		}

		if(!password || password.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(password, 10);

		await this.userRepository.updatePassword(user.email, hashedPassword);
	}

	async changePassword(email: string, oldPassword: string, newPassword: string) {
		if(!email || !oldPassword || !newPassword) {
			throw new InvalidInputError("Email, old password and new password must be provided")
		}

		email = email.toLowerCase();

		let user = await this.userRepository.findByEmail(email);

		if(!user) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		if(!bcrypt.compareSync(oldPassword, user.password)) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		if(newPassword.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(newPassword, 10);

		await this.userRepository.updatePassword(user.email, hashedPassword);

	}
}
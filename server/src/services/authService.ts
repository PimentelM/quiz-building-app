import {Injectable} from "../utils/architecturalDecorators";
import bcrypt from "bcryptjs";
import {db} from "../database";
import {InvalidInputError} from "../utils/applicationErrorClasses";
import jwt from "jsonwebtoken";
import {config} from "../config";
import {Inject} from "typedi";

let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export interface ISimpleMailSender {
	sendSimpleMail(to: string, subject: string, text: string): Promise<void>
}


@Injectable()
export class AuthService {

	constructor(@Inject("mailSenderService") private mailSenderService: ISimpleMailSender) {
	}


	public async login(email: string, password: string) {
		email = email.toLowerCase();

		let user = await db.User.findOne({email});

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

		let emailAlreadyInUse = await db.User.findOne({email});

		if(emailAlreadyInUse) {
			throw new InvalidInputError("Email already in use.");
		}

		if(!password || password.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(password, 10);

		let user = await db.User.create({
			email, password: hashedPassword, isInactive: true
		});

		delete (user as any).password

		await this.sendUserActivationEmail(email);

		return user;

	}

	async sendUserActivationEmail(email: string) {
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}
		email = email.toLowerCase();

		let user = await db.User.findOne({email});
		if(!user) {
			throw new InvalidInputError("Email not found");
		}

		let token = jwt.sign({
			type: "activateUser",
			email
		}, config.jwtSecret, {expiresIn: "1h"});

		let emailBody = `Please, access the following link to activate your account: ${config.frontendUrl}/activate-user?token=${token}`;

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

		let user = await db.User.findOne({email: decodedToken.email});

		if(!user) {
			throw new InvalidInputError("Invalid token");
		}

		await db.User.updateOne({_id: user._id}, {isInactive: false});
	}

	async sendResetPasswordEmail(email: string) {
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}
		email = email.toLowerCase();

		let user = await db.User.findOne({email});
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

		let user = await db.User.findOne({email: decodedToken.email});

		if(!user) {
			throw new InvalidInputError("Invalid token");
		}

		if(!password || password.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(password, 10);

		await db.User.updateOne({_id: user._id}, {password: hashedPassword});
	}

	async changePassword(email: string, oldPassword: string, newPassword: string) {
		if(!email || !oldPassword || !newPassword) {
			throw new InvalidInputError("Email, old password and new password must be provided")
		}

		email = email.toLowerCase();

		let user = await db.User.findOne({email});

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

		await db.User.updateOne({_id: user._id}, {password: hashedPassword});

	}
}
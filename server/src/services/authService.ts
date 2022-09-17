import {Injectable} from "../utils/architecturalDecorators";
import bcrypt from "bcryptjs";
import {db} from "../database";
import {InvalidInputError} from "../utils/applicationErrorClasses";
import jwt from "jsonwebtoken";
import {config} from "../config";

@Injectable()
export class AuthService {

	public async login(email: string, password: string) {
		if(!email || !password) {
			throw new InvalidInputError("Email and password must be provided")
		}

		email = email.toLowerCase();

		let user = await db.User.findOne({email});

		if(!user) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		if(user.isInactive) {
			throw new InvalidInputError("Account is inactive");
		}

		if(!bcrypt.compareSync(password, user.password)) {
			throw new InvalidInputError("Email or password is incorrect");
		}

		// Create token
		let payload = {
			id: user._id,
			email: user.email
		};

		let token = await jwt.sign(payload, config.jwtSecret)

		return token;
	}

	public async register(email: string, password: string) {
		if(!email || !password) {
			throw new InvalidInputError("Email and password must be provided")
		}

		// Test email format using regex
		let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if(!emailRegex.test(email)) {
			throw new InvalidInputError("Email is invalid");
		}

		email = email.toLowerCase();

		let emailAlreadyInUse = await db.User.findOne({email});

		if(emailAlreadyInUse) {
			throw new InvalidInputError("Email already in use.");
		}

		if(password.length < 8) {
			throw new InvalidInputError("Password must be at least 8 characters long.");
		}

		let hashedPassword = bcrypt.hashSync(password, 10);

		let user = await db.User.create({
			email, password: hashedPassword, isInactive: false
		});

		delete (user as any).password

		return user;

	}

}
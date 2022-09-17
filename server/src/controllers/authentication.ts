import {Controller, Post} from "../utils/controllerDecorators";
import {AuthService} from "../services/authService";


@Controller("/auth")
export class AuthenticationController {

	constructor(private authService: AuthService) {
	}

	@Post("/login")
	public async login(req,res) {
		let token = await this.authService.login(req.body.email, req.body.password);
		res.send({
			token
		});
	}

	@Post("/register")
	public async register(req,res) {
		await this.authService.register(req.body.email, req.body.password);
		res.send({
			message: "User successfully registered, check your email for an activation link",
		});
	}

	@Post("/send-reset-password-email")
	public async sendResetPasswordEmail(req,res) {
		await this.authService.sendResetPasswordEmail(req.body.email);
		res.send({
			message: "Password reset e-mail successfully sent"
		});
	}

	@Post("/reset-password")
	public async resetPassword(req,res) {
		let {token, password} = req.body;
		await this.authService.resetPassword(token, password);
		res.send({
			message: "Password successfully set"
		})
	}

	@Post("/change-password")
	public async changePassword(req,res) {
		let {email, oldPassword, newPassword} = req.body;
		await this.authService.changePassword(email, oldPassword, newPassword);
		res.send({
			message: "Password successfully changed"
		})
	}

	@Post("/activate-account")
	public async activateAccount(req,res) {
		let {token} = req.body;
		await this.authService.activateAccount(token);
		res.send({
			message: "Account successfully activated"
		})
	}

	@Post("/resend-activation-email")
	public async sendActivationEmail(req,res) {
		let {email} = req.body;
		await this.authService.sendUserActivationEmail(email);
		res.send({
			message: "Activation e-mail successfully sent"
		})
	}





}

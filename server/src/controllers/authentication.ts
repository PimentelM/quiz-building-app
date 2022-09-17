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
		let user = await this.authService.register(req.body.email, req.body.password);
		res.send(user);
	}


}

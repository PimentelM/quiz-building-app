import {Controller, Post} from "../utils/controllerDecorators";
import {AuthService} from "../services/authService";


@Controller("/auth")
export class AuthenticationController {

	constructor(private authService: AuthService) {
	}

	@Post("/login")
	public async login(req,res) {
		res.send(await this.authService.login(req.body.email, req.body.password));
	}

	@Post("/register")
	public register(req,res) {
		res.send("register");
	}


}

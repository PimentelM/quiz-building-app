import {Controller, Post} from "../utils/controllerDecorators";


@Controller("/auth")
export class AuthenticationController {

	@Post("/login")
	public login(req,res) {
		res.send("login");
	}

	@Post("/register")
	public register(req,res) {
		res.send("register");
	}


}

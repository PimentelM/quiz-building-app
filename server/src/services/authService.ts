import {Injectable} from "../utils/architecturalDecorators";

@Injectable()
export class AuthService {

	public async login(email: string, password: string): Promise<string> {

		return `TEST-TOKEN-${email}-${password}`;

	}

}
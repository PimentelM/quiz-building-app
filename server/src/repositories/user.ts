import {Injectable} from "../utils/architecturalDecorators";
import {User} from "../database/user";
import {db} from "../database";


export type BcryptHash = string;
interface IUserRepository {
	save(user: User): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
	updatePassword(email: string, newPassword: BcryptHash): Promise<void>;
	activateAccount(email: string): Promise<void>;
}


@Injectable()
export class UserRepository implements IUserRepository {
	async activateAccount(email: string): Promise<void> {
		await db.User.updateOne({email}, {isInactive: false});
	}

	async updatePassword(email: string, newPassword: BcryptHash): Promise<void> {
		await db.User.updateOne({email}, {password: newPassword});
	}

	async findByEmail(email: string): Promise<User | null> {
		let result = await db.User.findOne({email});
		return result?.toObject() ?? null;
	}

	async save(user: User): Promise<User> {
		let result = await db.User.create(user);

		return result.toObject();
	}


}
import {Quiz} from "../models/quiz";
import {db} from "../database";
import {createQuiz} from "../factories/quiz";
import {Injectable} from "../utils/architecturalDecorators";

interface IQuizRepository {
	getQuizById(id: string): Promise<Quiz | null>
	getQuizByPermaLinkId(permaLinkId: string): Promise<Quiz | null>
	deleteQuizById(id: string): Promise<void>
	saveQuiz(quiz: Quiz): Promise<void>
}

@Injectable()
export class QuizRepository implements IQuizRepository {
	async getQuizById(id: string): Promise<Quiz | null> {
		let result = await db.Quiz.findById(id);

		if(!result) {
			return null;
		}

		return createQuiz(result.toObject());
	}

	async getQuizByPermaLinkId(permaLinkId: string): Promise<Quiz | null> {
		let result = await db.Quiz.findOne({permaLinkId});

		if(!result) {
			return null;
		}

		return createQuiz(result.toObject());
	}

	async deleteQuizById(id: string): Promise<void> {
		await db.Quiz.deleteOne({id});
	}

	async saveQuiz(quiz: Quiz): Promise<void> {
		await db.Quiz.create(quiz);
	}
}
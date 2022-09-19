import {Quiz} from "../models/quiz";
import {db} from "../database";
import {createQuiz} from "../factories/quiz";
import {Injectable} from "../utils/architecturalDecorators";
import {ListElementQuiz} from "../dtos/listElementQuiz";

interface IQuizRepository {
	getQuizById(id: string): Promise<Quiz | null>
	getQuizByPermaLinkId(permaLinkId: string): Promise<Quiz | null>
	findAndDeleteQuizById(id: string, ownerId: string): Promise<Quiz | null>
	saveQuiz(quiz: Quiz): Promise<void>
	listQuizes(ownerId: string): Promise<ListElementQuiz[]>
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

	async findAndDeleteQuizById(id: string, ownerId: string): Promise<Quiz | null> {
		let result = await db.Quiz.findOneAndDelete({
			_id: id,
			ownerId
		});

		let quiz = result ? createQuiz(result.toObject()) : null;

		return quiz;
	}

	async saveQuiz(quiz: Quiz): Promise<void> {
		await db.Quiz.create(quiz);
	}

	async listQuizes(ownerId: string): Promise<ListElementQuiz[]> {
		let results = await db.Quiz.find({ownerId});

		let quizes = results.map((result) => new ListElementQuiz(createQuiz(result.toObject())));

		return quizes;
	}
}
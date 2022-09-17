import {Injectable} from "../utils/architecturalDecorators";
import {validateQuizCreationData} from "../schema-validators/createQuiz";
import { createQuiz } from "../factories/quiz";
import {QuizRepository} from "../repositories/quiz";
import {Quiz} from "../models/quiz";
@Injectable()
export class QuizService {

	constructor(private quizRepository: QuizRepository) {
	}

	public async createQuiz(data: any, ownerId: string) {
		// Validate quiz object
		let quizData = validateQuizCreationData(data);

		// Create Quiz Object from data
		let quiz : Quiz = createQuiz(quizData, ownerId);

		// Save quiz to database
		await this.quizRepository.saveQuiz(quiz);

		return quiz;
	}

}
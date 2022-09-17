import {Injectable} from "../utils/architecturalDecorators";
import {validateQuizCreationData} from "../schema-validators/createQuiz";
import {createQuiz, QuizCreationData} from "../factories/quiz";
import {QuizRepository} from "../repositories/quiz";
import {AnswerSignature, Quiz} from "../models/quiz";
import {InvalidInputError, NotFoundError} from "../utils/applicationErrorClasses";
@Injectable()
export class QuizService {

	constructor(private quizRepository: QuizRepository) {
	}

	public async createQuiz(quizData: QuizCreationData, ownerId: string) {
		if(quizData.permaLinkId) {
			throw new InvalidInputError("User can't provide the permaLinkId when creating a Quiz")
		}

		if(quizData._id){
			throw new InvalidInputError("User can't provide the _id when creating a Quiz")
		}

		// Create Quiz Object from data
		let quiz : Quiz = createQuiz(quizData, ownerId);

		// Save quiz to database
		await this.quizRepository.saveQuiz(quiz);

		return quiz;
	}

	public async listQuizes(ownerId: string) {
		return await this.quizRepository.listQuizes(ownerId);
	}

	public async computeQuizScore(quizId: string, answers: AnswerSignature[]) {
		let quiz = await this.quizRepository.getQuizById(quizId);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		let score = quiz.calculateScore(answers);

		return score;
	}

	public async getQuizById(id: string) {
		let quiz = await this.quizRepository.getQuizById(id);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		return quiz;
	}

	public async getQuizByPermaLinkId(permaLinkId: string) {
		let quiz = await this.quizRepository.getQuizByPermaLinkId(permaLinkId);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		return quiz;
	}

	public async findAndDeleteQuizById(id: string) {
		let quiz = await this.quizRepository.findAndDeleteQuizById(id);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		return quiz;
	}

}
import {Injectable} from "../utils/architecturalDecorators";
import {createQuiz, QuizCreationData} from "../factories/quiz";
import {QuizRepository} from "../repositories/quiz";
import {AnswerSignature, Quiz} from "../models/quiz";
import {InvalidInputError, NotFoundError} from "../utils/applicationErrorClasses";
import {PublicQuiz} from "../dtos/publicQuiz";
@Injectable()
export class QuizService {

	constructor(private quizRepository: QuizRepository) {
	}

	public async createQuiz(quizData: QuizCreationData, ownerId: string): Promise<Quiz> {
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

	public async listQuizes(ownerId: string) : Promise<Quiz[]> {
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

	public async getPublicQuizById(id: string) : Promise<PublicQuiz> {
		let quiz = await this.quizRepository.getQuizById(id);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}


		return new PublicQuiz(quiz);
	}

	public async getPublicQuizByPermaLinkId(permaLinkId: string) : Promise<PublicQuiz> {
		let quiz = await this.quizRepository.getQuizByPermaLinkId(permaLinkId);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		// Remove data that should not be public
		for(let question of quiz.questions){
			for(let possibleAnswer of question.possibleAnswers){
				delete (possibleAnswer as any).isCorrect
			}
		}

		return new PublicQuiz(quiz);
	}

	public async findAndDeleteQuizById(id: string) : Promise<Quiz> {
		let quiz = await this.quizRepository.findAndDeleteQuizById(id);

		if(!quiz) {
			throw new NotFoundError("Quiz not found");
		}

		return quiz;
	}

}
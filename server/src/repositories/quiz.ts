import {Quiz} from "../models/quiz";

interface IQuizRepository {
	getQuizById(id: string): Promise<Quiz | null>
	getQuizByPermaLinkId(permaLinkId: string): Promise<Quiz | null>
	deleteQuizById(id: string): Promise<void>
	saveQuiz(quiz: Quiz): Promise<void>
}
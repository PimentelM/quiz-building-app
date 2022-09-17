import {Controller, Delete, Get, Post} from "../utils/controllerDecorators";
import {requireAuth} from "../middlewares/authenticate";
import {Response} from "express";
import {getRequestContext} from "../middlewares/requestScopedContextStorage";
import {QuizService} from "../services/quizService";
import {validateAnswers} from "../schema-validators/computeScore";
import {AppError} from "../utils/applicationErrorClasses";
import {validateQuizCreationData} from "../schema-validators/createQuiz";


@Controller("/quiz")
export class QuizController {

	constructor(
		private quizService: QuizService
	) {
	}

	@Post("/", requireAuth)
	async create(req,res : Response) {
		let userId = getRequestContext().userId
		if(!userId) throw new AppError("User must be authenticated to create a quiz");

		let quizData = validateQuizCreationData(req.body);

		let quiz = await this.quizService.createQuiz(quizData, userId);

		res.status(201).send(quiz);
	}

	@Get("/:id")
	async getById(req,res) {
		let quiz = await this.quizService.getPublicQuizById(req.params.id);
		res.send(quiz);
	}

	@Get("/by-permalink-id/:id")
	async getByPermalinkId(req,res) {
		let quiz = await this.quizService.getPublicQuizByPermaLinkId(req.params.id);
		res.send(quiz);
	}

	@Get("/", requireAuth)
	async getAll(req,res) {
		let userId = getRequestContext().userId
		if(!userId) throw new AppError("User must be authenticated to get all quizzes");
		let quizzes = await this.quizService.listQuizes(userId);

		res.send(quizzes);
	}

	@Delete("/:id", requireAuth)
	async deleteById(req,res) {
		let quiz = await this.quizService.findAndDeleteQuizById(req.params.id);
		res.send(quiz);
	}

	@Post("/:id/compute-score")
	async computeScore(req, res) {
		let answers = validateAnswers(req.body.answers);

		let score = await this.quizService.computeQuizScore(req.params.id, answers);
		res.send({score});
	}
}

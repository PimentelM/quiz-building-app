import {Controller, Delete, Get, Post} from "../utils/controllerDecorators";
import {requireAuth} from "../middlewares/authenticate";
import {Response} from "express";
import {getRequestContext} from "../middlewares/requestScopedContextStorage";
import {QuizService} from "../services/quizService";


@Controller("/quiz")
export class QuizController {

	constructor(
		private quizService: QuizService
	) {
	}

	@Post("/", requireAuth)
	async create(req,res : Response) {
		let userId = getRequestContext().userId

		let quiz = await this.quizService.createQuiz(req.body, userId!);

		res.send(quiz);
	}

	@Get("/:id")
	async getById(req,res) {
		res.send("getById");
	}

	@Get("/by-permalink-id/:id")
	async getByPermalinkId(req,res) {
		res.send("getByPermalinkId");
	}

	@Get("/", requireAuth)
	async getAll(req,res) {
		res.send("getAll");
	}

	@Delete("/:id", requireAuth)
	async deleteById(req,res) {
		res.send("deleteById");
	}

	@Post("/:id/compute-results")
	async computeResults(req,res) {
		res.send("computeResults");
	}
}

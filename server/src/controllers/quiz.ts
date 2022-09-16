import {Controller, Delete, Get, Post} from "../utils/controllerDecorators";
import {requireAuth} from "../middlewares/authenticate";


@Controller("/quiz")
export class QuizController {

	@Post("/", requireAuth)
	async create(req,res) {
		res.send("create");
	}

	@Get("/by-permalink-id/:permalink-id")
	async getByPermalinkId(req,res) {
		res.send("getByPermalinkId");
	}

	@Get("/:id")
	async getById(req,res) {
		res.send("getById");
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

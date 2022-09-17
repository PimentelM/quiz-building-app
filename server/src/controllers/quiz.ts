import {Controller, Delete, Get, Post} from "../utils/controllerDecorators";
import {requireAuth} from "../middlewares/authenticate";
import {Response} from "express";


@Controller("/quiz")
export class QuizController {

	@Post("/", requireAuth)
	async create(req,res : Response) {
		res.send({
			_id: "teste",
			permalinkId: "teste"}
		);
		//res.send("create");
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

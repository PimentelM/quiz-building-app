import express from "express"

const router = express.Router()

router
	.post("/login")
	.post("/register")
	.post("/quiz")
	.get("/quiz/by-permalink-id/:permalink-id")
	.get("/quiz/:id")
	.get("/quiz")
	.delete("/quiz/:id")
	.post("/quiz/:id/compute-results")

export default router
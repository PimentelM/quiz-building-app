import express from "express";
import {getApp} from "../../app";
import {db, initDatabase} from "../../database";
import supertest from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import * as mongoose from "mongoose";

describe("Quiz Controller", () => {
	let app: express.Application;
	let dbServer;
	beforeAll(async () => {
		// Start mongodb in-memory server
		dbServer = await MongoMemoryServer.create()
		const uri = dbServer.getUri("testdb");
		// Connect to the in-memory database
		await initDatabase(uri);

		app = getApp();
	});

	beforeEach(async () => {
		// Clear all data
		await db.Quiz.deleteMany({});
	});

	afterAll(async () => {
		await dbServer.stop();
		await mongoose.disconnect();
	});

	it("POST /api/quiz - Creates a Quiz and returns permalink", async () => {
		const response = await supertest(app)
			.post("/api/quiz/")
			.set({ Authorization: "Bearer 123" })
			.send({
				title: "Test Quiz",
				questions: [
					{
						text: "Test Question",
						multipleChoice: false,
						possibleAnswers: [
							{
								text: "Test Answer",
								isCorrect: true,
							},
						],
					},
				],
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("_id");
		expect(response.body).toHaveProperty("permaLinkId");
		let savedQuiz = await db.Quiz.findById(response.body._id);
		expect(savedQuiz).toBeTruthy();
		expect(savedQuiz?.permaLinkId).toBe(response.body.permaLinkId);
		expect(savedQuiz?.title).toBe("Test Quiz");
		expect(savedQuiz?.questions.length).toBe(1);
		expect(savedQuiz?.questions[0].text).toBe("Test Question");
		expect(savedQuiz?.questions[0].multipleChoice).toBe(false);
		expect(savedQuiz?.questions[0].possibleAnswers.length).toBe(1);
		expect(savedQuiz?.questions[0].possibleAnswers[0].text).toBe("Test Answer");
		expect(savedQuiz?.questions[0].possibleAnswers[0].isCorrect).toBe(true);

	});

	it("GET /api/quiz/by-permalink-id/:permalinkId - Returns quiz with given permalink", async () => {
		const quiz = await db.Quiz.create({
			title: "Test Quiz",
			permaLinkId: "123456",
			ownerId: "123",
			questions: [
				{
					text: "Test Question",
					multipleChoice: false,
					answers: [
						{
							text: "Test Answer",
							isCorrect: true,
						},
					],
				},
			],
		});

		const response = await supertest(app)
			.get(`/api/quiz/by-permalink-id/${quiz.permaLinkId}`)
			.set({ Authorization: "Bearer 123" });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("_id");
		expect(response.body).toHaveProperty("permaLinkId");
		expect(response.body).toHaveProperty("title");
		expect(response.body).toHaveProperty("questions");
		expect(response.body.questions[0]).toHaveProperty("title");
		expect(response.body.questions[0]).toHaveProperty("multipleChoice");
		expect(response.body.questions[0]).toHaveProperty("answers");
		expect(response.body.questions[0].answers[0]).toHaveProperty("title");
		expect(response.body.questions[0].answers[0]).toHaveProperty("isCorrect");
	});

});
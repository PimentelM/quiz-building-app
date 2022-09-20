import * as dotenv from "dotenv";
dotenv.config({path: "./.env.test"});
import express from "express";
import {getApp} from "../../app";
import {db, initDatabase} from "../../database";
import supertest from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import * as mongoose from "mongoose";
import {injectTestDependencies} from "../test-utils";
import {getValidAuthToken, getValidQuizCreationData} from "../stubs";

injectTestDependencies();

describe("Quiz Controller", () => {
	let headers = {
		Authorization: getValidAuthToken("123")
	};
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
		let quizCreationData = getValidQuizCreationData();
		const response = await supertest(app)
			.post("/api/quiz/")
			.set(headers)
			.send(quizCreationData);

		expect(response.status).toBe(201);
		let savedQuiz = (await db.Quiz.findById(response.body._id))?.toObject();
		expect(savedQuiz).toBeTruthy();
		expect(savedQuiz).toMatchObject({
			_id: expect.anything(),
			ownerId: "123",
			permaLinkId: expect.any(String),
			...quizCreationData,
		});


	});

	it("GET /api/quiz/by-permalink-id/:permalinkId - Returns quiz with given permalink, don't reveal correct answers", async () => {
		let quizCreationData = getValidQuizCreationData({ownerId: "123", permaLinkId: "123456"})
		const quiz = await db.Quiz.create(quizCreationData);

		const response = await supertest(app)
			.get(`/api/quiz/by-permalink-id/${quiz.permaLinkId}`)

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			_id: expect.any(String),
			permaLinkId: expect.any(String),
			ownerId: expect.any(String),
			questions: expect.any(Array),
		});
		expect(response.body.questions).toBeDefined()
		expect(response.body.questions[0].possibleAnswers).toBeDefined()
		expect(response.body.questions[0].possibleAnswers[0].isCorrect).toBeUndefined();
		expect(response.body.questions[0].possibleAnswers[1].isCorrect).toBeUndefined();

	});

	it("GET /api/quiz/:id - Returns quiz with given id, don't reveal correct answers", async () => {
		let quizCreationData = getValidQuizCreationData({ownerId: "123", permaLinkId: "123456"})
		const quiz = await db.Quiz.create(quizCreationData);

		const response = await supertest(app)
			.get(`/api/quiz/${quiz._id}`)

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			_id: expect.any(String),
			permaLinkId: expect.any(String),
			ownerId: expect.any(String),
			questions: expect.any(Array),
		});
		expect(response.body.questions).toBeDefined()
		expect(response.body.questions[0].possibleAnswers).toBeDefined()
		expect(response.body.questions[0].possibleAnswers[0].isCorrect).toBeUndefined();
		expect(response.body.questions[0].possibleAnswers[1].isCorrect).toBeUndefined();

	})

	it("GET /api/quiz - Returns all quizzes of currently logged-in user", async () => {
		let quizCreationData1 = getValidQuizCreationData({ownerId: "123", permaLinkId: "111222"})
		let quizCreationData2 = getValidQuizCreationData({ownerId: "123", permaLinkId: "222333"})
		let quizCreationData3 = getValidQuizCreationData({ownerId: "999", permaLinkId: "444555"})
		await db.Quiz.create(quizCreationData1);
		await db.Quiz.create(quizCreationData2);
		await db.Quiz.create(quizCreationData3);

		const response = await supertest(app)
			.get("/api/quiz")
			.set(headers);

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(2);
		expect(response.body).toContainEqual(expect.objectContaining({
			_id: expect.any(String),
			permaLinkId: expect.any(String),
			title: expect.any(String),
			questionCount: expect.any(Number),
		}))
		expect(response.body).toContainEqual(expect.objectContaining({
			_id: expect.any(String),
			permaLinkId: expect.any(String),
			title: expect.any(String),
			questionCount: expect.any(Number),
		}));
	})

	it("DELETE /api/quiz/:id - Deletes quiz with given id and returns it's data", async () => {
		let quizCreationData = getValidQuizCreationData({ownerId: "123", permaLinkId: "123456"})
		const quiz = await db.Quiz.create(quizCreationData);

		const response = await supertest(app)
			.delete(`/api/quiz/${quiz._id}`)
			.set(headers);

		expect(response.status).toBe(200);
		expect(await db.Quiz.findById(quiz._id)).toBeNull();
		expect(response.body).toMatchObject({
			_id: expect.any(String),
			...quizCreationData
		});


	});
	
	it("POST /api/quiz/:id/compute-score - Should get number of correct answers", async () => {
		let quizCreationData = getValidQuizCreationData({ownerId: "123", permaLinkId: "123456",
			questions: [{
				text: "Is the sky blue?",
				multipleChoice: false,
				possibleAnswers: [
					{text: "Yes", isCorrect: true},
					{text: "No", isCorrect: false}]},
			{
				text: "Select letters",
				multipleChoice: true,
				possibleAnswers: [
					{text: "A", isCorrect: true},
					{text: "B", isCorrect: true},
					{text: "9", isCorrect: false}]
			},{
				text: "Second letter of the alphabet",
				multipleChoice: false,
				possibleAnswers: [
					{text: "A", isCorrect: false},
					{text: "B", isCorrect: true},
					{text: "Z", isCorrect: false},
					{text: "K", isCorrect: false},
					{text: "Y", isCorrect: false}]
			}]
		})
		const quiz = await db.Quiz.create(quizCreationData);

		const response = await supertest(app)
			.post(`/api/quiz/${quiz._id}/compute-score`)
			.send({
				answers: [[true, false], [true, true, false], [true,false, false, false,false]]
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			score: 2
		});
	});

	describe("Security", () => {

		it("Should not be possible to create a quiz if you are not logged in", async () => {
			const response = await supertest(app)
				.post("/api/quiz")
				.send(getValidQuizCreationData());
			expect(response.status).toBe(401);
		});

		it("Should not delete a quiz owned by another user", async () => {
			let quizCreationData = getValidQuizCreationData({ownerId: "123", permaLinkId: "123456"})
			const quiz = await db.Quiz.create(quizCreationData);

			const response = await supertest(app)
				.delete(`/api/quiz/${quiz._id}`)
				.set({
					...headers,
					Authorization: getValidAuthToken("456")
				});

			expect(response.status.toString()).toMatch(/(401)|(403)|(400)|(404)/);
		});
	})
	

});
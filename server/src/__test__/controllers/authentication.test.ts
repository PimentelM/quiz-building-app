import * as dotenv from "dotenv";
dotenv.config({path: "./.env.test"});
import express from "express";
import {db, initDatabase} from "../../database";
import supertest from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import * as mongoose from "mongoose";
import {injectTestDependencies} from "../test-utils";
injectTestDependencies()
import {getApp} from "../../app";
import Container from "typedi";


describe("Authentication Controller", () => {
	let app: express.Application;
	let dbServer;
	let mockMailService;
	beforeAll(async () => {
		// Start mongodb in-memory server
		dbServer = await MongoMemoryServer.create()
		const uri = dbServer.getUri("testdb");
		// Connect to the in-memory database
		await initDatabase(uri);

		mockMailService = Container.get("mailSenderService");

		app = getApp();
	});

	beforeEach(async () => {
		// Clear all data
		await db.User.deleteMany({});
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await dbServer.stop();
		await mongoose.disconnect();
	});

	it("POST /api/auth/register should register a new user", async () => {

		const response = await supertest(app)
			.post("/api/auth/register")
			.send({
				email: "test@test.com",
				password: "12345678"
			});

		expect(response.status).toBe(200);
		expect(response.body?.message).toMatch(/.*successfully registered.*e-?mail.*activation link.*/i)

		// Check that email was sent
		expect(mockMailService.sendSimpleMail).toBeCalledTimes(1);
		expect(mockMailService.sendSimpleMail).toBeCalledWith("test@test.com", expect.any(String), expect.any(String));

		// Check that user was created
		let user = await db.User.findOne({email: "test@test.com"});
		expect(user).toBeTruthy();
	})



});
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
import jwt from "jsonwebtoken";
import {config} from "../../config";
import bcrypt from "bcryptjs";

function getValidUser(overwrites = {}) {
	return {
		email: "test@test.com",
		password: bcrypt.hashSync("12345678", 10),
		isInactive: false,
		...overwrites
	}
}

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

	it("POST /api/auth/register should register a new user and send activation email", async () => {

		const response = await supertest(app)
			.post("/api/auth/register")
			.send({
				email: "test@test.com",
				password: "12345678"
			});

		// Check that proper response is returned
		expect(response.status).toBe(200);
		expect(response.body?.message).toMatch(/.*successfully registered.*e-?mail.*activation link.*/i)

		// Check that email was sent
		expect(mockMailService.sendSimpleMail).toBeCalledTimes(1);
		expect(mockMailService.sendSimpleMail).toBeCalledWith("test@test.com", expect.any(String), expect.any(String));

		// Check that user was created
		let user = await db.User.findOne({email: "test@test.com"});
		expect(user).toBeTruthy();
		expect(user?.email).toBe("test@test.com");
		expect(user?.password).not.toBe("12345678");
		expect(user?.isInactive).toBe(true);
	})

	it("POST /api/auth/login Active user should return a token after successful login", async () => {
		await db.User.create(getValidUser());

		const response = await supertest(app)
			.post("/api/auth/login")
			.send({email: "test@test.com", password: "12345678"});

		expect(response.status).toBe(200);
		expect(response.body?.token).toBeTruthy();
	})

	it("POST /api/auth/login Inactive user should not be able to login", async () => {
		let user = await db.User.create(getValidUser({isInactive: true}));

		const response = await supertest(app)
			.post("/api/auth/login")
			.send({email: "test@test.com", password: "12345678"});

		expect(response.status).toBe(400);
		expect(response.body?.token).toBeFalsy();
	})

	it("POST /api/auth/activate-account", async () => {
		await db.User.create(getValidUser({isInactive: true}));
		let token = jwt.sign({email: "test@test.com", type: "activateUser"}, config.jwtSecret, {expiresIn: "1h"});

		const response = await supertest(app).post("/api/auth/activate-account").send({token});

		expect(response.status).toBe(200);
		expect(response.body?.message).toMatch(/.*successfully activated.*/i);
		// Check if user is active
		let user = await db.User.findOne({email: "test@test.com"});
		expect(user?.isInactive).toBe(false);
	});


});
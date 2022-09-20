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

function getActivationToken(email: string) {
	return jwt.sign({email, type: "activateUser"}, config.jwtSecret, {expiresIn: "1h"});
}

function getPasswordResetToken(email: string) {
	return jwt.sign({email, type: "resetPassword"}, config.jwtSecret, {expiresIn: "1h"});
}

function getInvalidPasswordResetToken(email: string) {
	return jwt.sign({email, type: "resetPassword"}, "invalidSecret", {expiresIn: "1h"});
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
		expect(mockMailService.sendSimpleMail).toBeCalledWith("test@test.com", expect.any(String), expect.stringMatching(/.*link.*http.*token.*/i));

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

	it("POST /api/auth/activate-account should activate account", async () => {
		await db.User.create(getValidUser({isInactive: true}));
		let token = getActivationToken("test@test.com");

		const response = await supertest(app).post("/api/auth/activate-account").send({token});

		expect(response.status).toBe(200);
		expect(response.body?.message).toMatch(/.*successfully activated.*/i);
		// Check if user is active
		let user = await db.User.findOne({email: "test@test.com"});
		expect(user?.isInactive).toBe(false);
	});

	it("POST /api/auth/activate-account should not activate user if token is invalid", async () => {
		await db.User.create(getValidUser({isInactive: true}));
		let token = getActivationToken("another@email.com")

		const response = await supertest(app).post("/api/auth/activate-account").send({token});

		expect(response.status).toBe(400);
		// Check if user is active
		let user = await db.User.findOne({email: "test@test.com"});
		expect(user?.isInactive).toBe(true);
	})

	it("POST /api/auth/reset-password should change user password", async () => {
		let beforeUser = await db.User.create(getValidUser());
		let token = getPasswordResetToken("test@test.com");

		const response = await supertest(app).post("/api/auth/reset-password").send({token, password: "newPassword"});

		expect(response.status).toBe(200);
		expect(response.body?.message).toMatch(/.*password successfully (changed|set).*/i);
		// Check if user password was changed
		let afterUser = await db.User.findOne({email: "test@test.com"});
		expect(afterUser?.password).not.toBe(beforeUser?.password);

	});

	it("POST /api/auth/reset-password should not change user password if email @ token does'nt match", async () => {
		let token = getPasswordResetToken("another@email.com")
		let beforeUser = await db.User.create(getValidUser());
		const response = await supertest(app).post("/api/auth/reset-password").send({token, password: "newPassword"});

		expect(response.status).toBe(400);

		// Check if user password was changed
		let afterUser = await db.User.findOne({email: "test@test.com"});
		expect(afterUser?.password).toBe(beforeUser?.password);
	});

	it("POST /api/auth/reset-password should not change user password if token is signed with different secret", async () => {
		let token = getInvalidPasswordResetToken("test@test.com");

		let beforeUser = await db.User.create(getValidUser());
		const response = await supertest(app).post("/api/auth/reset-password").send({token, password: "newPassword"});

		expect(response.status).toBe(400);

		// Check if user password was changed
		let afterUser = await db.User.findOne({email: "test@test.com"});
		expect(afterUser?.password).toBe(beforeUser?.password);
	});


});
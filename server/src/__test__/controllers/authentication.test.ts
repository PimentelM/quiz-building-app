import express from "express";
import {getApp} from "../../app";
import {db, initDatabase} from "../../database";
import supertest from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import * as mongoose from "mongoose";
import {MailSender} from "../../services/mailSender";

describe("Authentication Controller", () => {
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
		await db.User.deleteMany({});
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
	})



});
import Quiz from "./quiz";
import User from "./user";
import { connect } from "mongoose";
import {config} from "../config";


export async function initDatabase(connectionString?: string) {
	console.log("Connecting to database...")
	await connect(connectionString ?? config.databaseConnectionString);
	console.log("Connected to database.")
}

export const db = {
	Quiz,
	User
}
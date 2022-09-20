import {Schema, model} from "mongoose";

export interface User {
	_id: string;
	email: string;
	password: string;
	isInactive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new Schema({
	email: {type: String, required: true, unique: true, index: true},
	password: {type: String, required: true},
	isInactive: {type: Boolean, required: true, default: true},
}, {
	timestamps: true
});

export default model("User", schema);
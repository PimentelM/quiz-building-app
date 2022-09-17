import {Schema, model} from "mongoose";


const schema = new Schema({
	email: {type: String, required: true, unique: true, index: true},
	password: {type: String, required: true},
	isInactive: {type: Boolean, required: true, default: true},
}, {
	timestamps: true
});

export default model("User", schema);
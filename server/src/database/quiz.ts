import {Schema, model} from "mongoose";

const schema = new Schema({
	ownerId: {type: String, required: true, index: true},
	permaLinkId: {type: String, required: true, unique: true, index: true},
	title: {type: String, required: true},
	questions: [{
		text: {type: String, required: true},
		multipleChoice: {type: Boolean, required: true},
		possibleAnswers: [{
			text: {type: String, required: true},
			isCorrect: {type: Boolean, required: true},
		}]
	}]
});

schema.index({ownerId: 1, _id: 1}, {unique: true});

export default model("Quiz", schema);
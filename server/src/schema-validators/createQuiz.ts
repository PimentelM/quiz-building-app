import joi from "joi";
import {InvalidInputError} from "../errors";
import {QuizCreationData} from "../factories/quiz";

let possibleAnswer = joi.object({
	_id: joi.any().optional(),
	text: joi.string().required(),
	isCorrect: joi.boolean().required(),
})

let question = joi.object({
	_id: joi.any().optional(),
	text: joi.string().required(),
	multipleChoice: joi.boolean().required(),
	possibleAnswers: joi.array().items(possibleAnswer).required(),
})

let quiz = joi.object({
	_id: joi.any().optional(),
	ownerId: joi.string().optional(),
	permaLinkId: joi.string().optional(),
	title: joi.string().required(),
	questions: joi.array().items(question).required(),
}).options({
	allowUnknown: true
})



export const validateQuizCreationData = (quizCreationData: unknown) : QuizCreationData=> {
	let results = quiz.validate(quizCreationData, {abortEarly: true});

	if(results.error) {
		throw new InvalidInputError(results.error.message);
	}

	return results.value as QuizCreationData;
}


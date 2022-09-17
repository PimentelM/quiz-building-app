import joi from "joi";
import {InvalidInputError} from "../utils/applicationErrorClasses";
import {QuizCreationData} from "../factories/quiz";


let possibleAnswer =	joi.object({
	text: joi.string().required(),
	isCorrect: joi.boolean().required(),
})

let question = joi.object({
	text: joi.string().required(),
	multipleChoice: joi.boolean().required(),
	possibleAnswers: joi.array().items(possibleAnswer).required(),
})

let quiz = joi.object({
	title: joi.string().required(),
	questions: joi.array().items(question).required(),
})



export const validateQuizCreationData = (quizCreationData: unknown) : QuizCreationData=> {
	let results = quiz.validate(quizCreationData, {abortEarly: true});

	if(results.error) {
		throw new InvalidInputError(results.error.message);
	}

	return results.value as QuizCreationData;
}


import joi from "joi";
import {InvalidInputError} from "../errors";
import {AnswerSignature} from "../models/quiz";


let answerSignature = joi.array().items(joi.boolean()).max(5).min(1).required();

let answerSignatures = joi.array().items(answerSignature).max(10).min(1).required();


export function validateAnswers(answers: unknown) : AnswerSignature[] {
	let results = answerSignatures.validate(answers, {abortEarly: true});

	if(results.error) {
		throw new InvalidInputError(results.error.message);
	}

	return results.value as AnswerSignature[];
}
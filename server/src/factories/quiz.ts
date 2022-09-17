import {PossibleAnswer, Question, Quiz} from "../models/quiz";
import {getPermaLinkId, getUniqueId} from "../utils/uniqueIdGenerator";
import {AppError} from "../utils/applicationErrorClasses";
import {validateQuizCreationData} from "../schema-validators/createQuiz";

export interface QuizCreationData {
	_id?: string,
	ownerId?: string,
	permaLinkId?: string,
	title: string,
	questions: {
		text: string,
		multipleChoice: boolean,
		possibleAnswers: {
			text: string,
			isCorrect: boolean,
		}[]
	}[]
}

export const createQuiz = (quizData: QuizCreationData, ownerId?: string) : Quiz => {
	if(!ownerId && !quizData.ownerId) {
		throw new AppError("Owner ID is required");
	}
	validateQuizCreationData(quizData);

	let questions : Question[] = [];

	for(let question of quizData.questions) {
		let possibleAnswers = question.possibleAnswers.map((possibleAnswer) => (new PossibleAnswer(
			possibleAnswer.text,
			possibleAnswer.isCorrect
		)))

		questions.push(new Question(
			question.text,
			question.multipleChoice,
			possibleAnswers))
	}

	ownerId = quizData.ownerId || ownerId;
	let id = quizData._id ?? getUniqueId();
	let permaLinkId =  quizData.permaLinkId ?? getPermaLinkId();

	let quiz = new Quiz(
		ownerId!,
		id,
		permaLinkId,
		quizData.title,
		questions
	);

	return quiz;
}

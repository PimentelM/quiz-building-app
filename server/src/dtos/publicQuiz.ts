import {Quiz} from "../models/quiz";

interface PublicPossibleAnswer {
	text: string,
}

interface PublicQuestion {
	text: string,
	multipleChoice: boolean,
	possibleAnswers: PublicPossibleAnswer[]
}

export class PublicQuiz {
	_id: string
	ownerId: string
	permaLinkId: string
	title: string
	questions: PublicQuestion[]

	constructor(quiz: Quiz) {
		this._id = quiz._id
		this.ownerId = quiz.ownerId
		this.permaLinkId = quiz.permaLinkId
		this.title = quiz.title
		this.questions = quiz.questions.map((question) => {
			return {
				text: question.text,
				multipleChoice: question.multipleChoice,
				possibleAnswers: question.possibleAnswers.map((possibleAnswer) => {
					return {
						text: possibleAnswer.text,
					}
				}),
			}
		})
	}
}







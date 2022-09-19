import {Quiz} from "../models/quiz";

export class ListElementQuiz {
	_id: string
	ownerId: string
	permaLinkId: string
	title: string
	questionCount: number

	constructor(quiz: Quiz) {
		this._id = quiz._id
		this.ownerId = quiz.ownerId
		this.permaLinkId = quiz.permaLinkId
		this.title = quiz.title
		this.questionCount = quiz.questions.length
	}
}
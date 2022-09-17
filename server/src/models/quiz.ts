import {InvalidInputError} from "../utils/applicationErrorClasses";

export type AnswerSignature = boolean[]

export type PossibleAnswers = PossibleAnswer[]

export class PossibleAnswer {
	constructor(
		public readonly text: string,
		public readonly isCorrect: boolean,
	) {
	}
}

export class Question {
	public readonly text: string
	public readonly multipleChoice: boolean
	public readonly possibleAnswers: PossibleAnswers

	constructor(text: string, multiple: boolean, possibleAnswers: PossibleAnswers) {
		this.multipleChoice = multiple;
		this.text = text
		this.possibleAnswers = possibleAnswers

		if(possibleAnswers.length < 1) {
			throw new InvalidInputError("A question must have at least 1 possible answer")
		}

		if (!multiple) {
			// Checks if there is more than one correct answer
			const correctAnswers = this.possibleAnswers.map(x=>Number(x.isCorrect)).reduce((a,b)=>a+b,0);
			if (correctAnswers > 1) {
				throw new InvalidInputError("Multiple choice questions must have only one correct answer")
			}
		}

	}

	public isAnswerCorrect(answer: AnswerSignature): boolean {
		for (const key in this.possibleAnswers) {
			if (this.possibleAnswers[key].isCorrect !== answer[key]) {
				return false
			}
		}
		return true;
	}

}

export class Quiz {
	public readonly id: string
	public readonly permaLinkId: string
	public readonly title: string
	public readonly questions: ReadonlyArray<Question>

	constructor(id: string, permaLinkId: string, title: string, questions: Question[]) {
		this.id = id
		this.permaLinkId = permaLinkId
		this.title = title
		this.questions = questions;

		if (!/^[a-zA-Z0-9]{6}$/.test(permaLinkId)) {
			throw new InvalidInputError("Permalink should be a string containing 6 alphanumeric characters")
		}

		if (questions.length > 10) {
			throw new InvalidInputError("Quiz cannot have more than 10 questions")
		}
	}

	public checkIsCorrect(answers: AnswerSignature[]): boolean {
		if (answers.length !== this.questions.length) {
			return false
		}
		for (let i = 0; i < this.questions.length; i++) {
			if (!this.questions[i].isAnswerCorrect(answers[i])) {
				return false
			}
		}
		return true;
	}
}
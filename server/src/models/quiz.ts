import {InvalidInputError} from "../errors";

export type AnswerSignature = boolean[]

export class PossibleAnswer {
	constructor(
		public readonly text: string,
		public readonly isCorrect: boolean,
	) {
		if (this.text.length < 1 || this.text.length > 255) {
			throw new InvalidInputError("Possible answer text must be between 1 and 255 characters long")
		}
	}
}

export class Question {
	public readonly text: string
	public readonly multipleChoice: boolean
	public readonly possibleAnswers: ReadonlyArray<PossibleAnswer>

	constructor(text: string, multiple: boolean, possibleAnswers: PossibleAnswer[]) {
		this.multipleChoice = multiple;
		this.text = text
		this.possibleAnswers = possibleAnswers

		if(this.possibleAnswers.length > 5)
			throw new InvalidInputError("A question can have at most 5 possible answers")

		if(this.text.length < 1 || this.text.length > 1024) {
			throw new InvalidInputError("Question text must be between 1 and 1024 characters long")
		}

		if(possibleAnswers.length < 1) {
			throw new InvalidInputError("A question must have at least 1 possible answer")
		}

		if(this.possibleAnswers.filter((possibleAnswer) => possibleAnswer.isCorrect).length < 1) {
			throw new InvalidInputError("A question must have at least 1 correct answer")
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
	public readonly _id: string
	public readonly permaLinkId: string
	public readonly title: string
	public readonly questions: ReadonlyArray<Question>
	public readonly ownerId: string


	constructor(ownerId: string,id: string, permaLinkId: string, title: string, questions?: Question[]) {
		this.ownerId = ownerId;
		this._id = id
		this.permaLinkId = permaLinkId
		this.title = title
		this.questions = questions ?? [];

		if (!/^[a-zA-Z0-9]{6}$/.test(permaLinkId)) {
			throw new InvalidInputError("Permalink should be a string containing 6 alphanumeric characters")
		}

		if(this.title.length < 1 || this.title.length > 255) {
			throw new InvalidInputError("Title should be between 1 and 255 characters")
		}

		if (this.questions.length > 10) {
			throw new InvalidInputError("Quiz cannot have more than 10 questions")
		}

		if(this.questions.length < 1) {
			throw new InvalidInputError("Quiz must have at least 1 question")
		}
	}

	public calculateScore(answers: AnswerSignature[]): number {
		if (answers.length !== this.questions.length) {
			throw new InvalidInputError("Number of answers does not match number of questions")
		}
		let score = 0;
		for (let i = 0; i < this.questions.length; i++) {
			if (this.questions[i].isAnswerCorrect(answers[i])) {
				score++;
			}
		}
		return score;
	}
}
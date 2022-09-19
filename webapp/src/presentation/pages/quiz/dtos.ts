
export interface PossibleAnswer {
	text: string,
	isCorrect: boolean,
}

export interface Question {
	text: string,
	multipleChoice: boolean,
	possibleAnswers: PossibleAnswer[]
}

export interface Quiz {
	_id?: string
	ownerId?: string
	permaLinkId?: string
	title: string
	questions: Question[]
}

export interface QuizListElement {
	_id: string
	ownerId: string
	permaLinkId: string
	title: string
	questionCount: number
}
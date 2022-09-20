import {PossibleAnswer, Question, Quiz} from "../dtos";
import {useState} from "react";
import {useApi} from "../../../../hooks/useApi";

export function useQuizBuilderViewModel() {

	// Stages:

	// First you create the quiz title.

	// Then you create the questions

	// Every question requires the creation of alternatives.

	// You need at least one question to create a quiz

	// You need at least one alternative to create a question

	// Max of 5 alternatives per question

	// Max of 10 questions per quiz

	// Every question needs to have at least one correct alternative in order to be stored.


	function isQuizValid(quiz: Quiz): boolean {
		return quiz.questions.length > 0
	}

	function canAddQuestion(quiz: Quiz): boolean {
		return quiz.questions.length < 10
	}


	function addQuestion(quiz: Quiz, question: Question, answerSignature: boolean[]): Quiz {
		if (answerSignature.length !== question.possibleAnswers.length)
			throw new Error("Answer length must be equal to possible answers length")

		question.possibleAnswers.forEach((a, i) => a.isCorrect = answerSignature[i])

		quiz.questions.push(question)

		return {
			...quiz,
		}
	}

	function canDeleteQuestion(quiz: Quiz): boolean {
		return quiz.questions.length > 1
	}

	function deleteQuestion(quiz: Quiz, questionIndex: number): Quiz {
		quiz.questions.splice(questionIndex, 1)
		return {
			...quiz,
		}
	}

	function createQuiz(title: string): Quiz {
		return {
			title,
			questions: []
		}
	}


	// State:
	let [quiz, setQuiz] = useState<Quiz | null>(null);
	let [page, setPage] = useState<"display" | "add_question" | "done" | undefined>(undefined);

	function defineQuizTitle(title: string) {
		setQuiz(createQuiz(title))
	}

	function addQuestionToQuiz(question: Question, answerSignature: boolean[]) {
		if (quiz === null) throw new Error("Quiz is null")

		setQuiz(addQuestion(quiz, question, answerSignature))

		setPage("display")
	}

	function deleteQuestionFromQuiz(questionIndex: number) {
		if (quiz === null) throw new Error("Quiz is null")

		setQuiz(deleteQuestion(quiz, questionIndex))
	}

	let state = {
		page,
		requireAddTitle: quiz === null,
		requireAddQuestion: quiz?.questions.length === 0,
		readyToSubmit: quiz !== null && isQuizValid(quiz),
		canAddQuestion: quiz !== null && canAddQuestion(quiz),
		canDeleteQuestion: quiz !== null && canDeleteQuestion(quiz),
	}

	//

	let {api} = useApi()
	let [permaLinkId, setPermaLinkId] = useState<string>("");
	let [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	let [submitError, setSubmitError] = useState<string>("");

	function submitQuiz() {
		if (!state.readyToSubmit) throw new Error("Quiz is not ready to be submitted")

		setIsSubmitting(true)
		api.createQuiz(quiz!)
			.then(data => {
				setPermaLinkId(data.permaLinkId)
				setPage("done")
			})
			.catch(e => {
				setSubmitError(e.message)})
			.finally(() => {
				setIsSubmitting(false)
			})
	}


	return {
		state,
		quiz,
		defineQuizTitle,
		addQuestionToQuiz,
		deleteQuestionFromQuiz,
		submitQuiz,
		isSubmitting,
		submitError,
		permaLinkId,
		page,
		setPage
	}


}


export function addQuestionViewModel(canGoBack: boolean, goBack: ()=>void ,onSubmit: (question: Question, answerSignature: boolean[]) => void){
	let [multipleChoice, _setMultipleChoice] = useState(false);
	let [alternatives, setAlternatives] = useState<string[]>([]);
	let [text, setText] = useState("");
	let [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
	let [currentAlternativeText, setCurrentAlternativeText] = useState("");

	let isFormValid = text.length > 0 && alternatives.length > 0 && correctAnswers.length > 0;

	// Don't add repeated alternatives
	let canAddAlternative =
		currentAlternativeText.length > 0 &&
		alternatives.length < 5 &&
		!alternatives.includes(currentAlternativeText);


	function handleMultipleChoiceChange(e: any) {
		let multipleChoice = e.target.value
		_setMultipleChoice(multipleChoice)

		if (!multipleChoice) {
			setCorrectAnswers(correctAnswers.slice(0, 1))
		}

	}

	function addAlternative(): void {
		setAlternatives([...alternatives, currentAlternativeText])
		setCurrentAlternativeText("");
	}

	function deleteAlternative(i : number){
		let result = [...alternatives]
		result.splice(i, 1)
		setAlternatives(result)

		setCorrectAnswers(correctAnswers.filter(
			(x)=> result.includes(x)
		))
	}


	function handleSubmit() {

		// Create question:
		let answerSignature: boolean[] = alternatives.map(text => correctAnswers.includes(text))
		let possibleAnswers: PossibleAnswer[] = alternatives.map((text, i) => ({text, isCorrect: answerSignature[i]}))
		let question: Question = {
			text,
			possibleAnswers,
			multipleChoice
		}

		onSubmit(question, answerSignature)
	}

	return {
		handleMultipleChoiceChange,
		setCurrentAlternativeText,
		setCorrectAnswers,
		deleteAlternative,
		addAlternative,
		handleSubmit,
		setText,
		multipleChoice,
		alternatives,
		text,
		correctAnswers,
		currentAlternativeText,
		canAddAlternative,
		isFormValid,
	}
}


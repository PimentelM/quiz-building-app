import {usePrivatePage} from "../../../../hooks/usePrivatePage";
import {PossibleAnswer, Question, Quiz} from "../dtos";
import {useState} from "react";
import {AutoComplete, Button, Input, Radio, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useApi} from "../../../../hooks/useApi";
import { Link } from "@tanstack/react-location";

function QuestionDisplay({question} : {question: Question}) {
	let correctAnswers = question.possibleAnswers.filter(x => x.isCorrect).map(x => x.text)
	return <div className={"w-[240px] min-h-[120px] px-4 py-4 border flex flex-col"}>
		<div className={"font-medium text-lg"}>
			{question.text}
		</div>
		<div className={"text-gray-600"}>
			{question.multipleChoice ? "Multiple choice" : "Single choice"}
		</div>
		<div>
			{question.multipleChoice ? "Correct answers: " : "Correct answer: "}
		</div>
		<div className={"flex flex-col"}>
			{correctAnswers.map((x, i) => <div key={i} className={"text-gray-600"}>- {x}</div>)}
		</div>
	</div>
}

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

	let state = {
		page,
		requireAddTitle: quiz === null,
		requireAddQuestion: quiz?.questions.length === 0,
		readyToSubmit: quiz !== null && isQuizValid(quiz),
		canAddQuestion: quiz !== null && canAddQuestion(quiz),
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
		submitQuiz,
		isSubmitting,
		submitError,
		permaLinkId,
		page,
		setPage
	}


}

function Wrapper({children, quiz}: { children: any, quiz: Quiz | null }) {
	return <div className={"w-[100%] pt-4"}>
		<div className={"flex flex-col"}>
			<div className={"flex justify-center"}>
				<div className={"text-2xl"}>
					Quiz Builder
				</div>
			</div>

			<div>
				<div className={"w-[80vw] m-auto"}>
					{children}
				</div>
			</div>

			{/*Quiz Preview*/}
			<div className={"w-[50vw] bg-gray-50 m-auto mt-10"}>
				<pre>{JSON.stringify(quiz, null, 2)}</pre>
			</div>
		</div>
	</div>

}

function DefineQuizTitle({onSubmit}: { onSubmit: (title: string) => void }) {

	function handleSubmit(e: any) {
		e.preventDefault();
		onSubmit(e.target.title.value)
	}


	return <div className={"flex flex-col"}>
		<div className={"pt-12 text-xl"}>
			1) Please, define the quiz title:
		</div>
		<form onSubmit={handleSubmit}>
			<div className={"flex flex-col gap-2"}>
				<Input required minLength={3} maxLength={64} name="title" type={"text"}/>
				<button className={"authPrimaryButton"} type="submit">Send</button>
			</div>
		</form>
	</div>
}

function AddQuestion({onSubmit, canGoBack, goBack}: { canGoBack: boolean, goBack: ()=>void ,onSubmit: (question: Question, answerSignature: boolean[]) => void }) {


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


	function handleSubmit(e: any) {
		e.preventDefault();

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


	return <div className={"flex flex-col"}>
		<div className={"pt-12 text-xl"}>
			2) Now add a question:
		</div>
		<form onSubmit={handleSubmit}>
			<div className={"flex flex-col gap-2"}>
				<Input onChange={e => setText(e.target.value)} placeholder={"Question text"} required minLength={3}
					   maxLength={64} name="text"/>

				<div className={"text-md font-medium"}>
					Type:
				</div>

				<div className={"text-md font-medium"}>
					<Radio.Group defaultValue={false}
								 onChange={handleMultipleChoiceChange}>

						<Radio name={"multipleChoice"} value={false}>
							Single Choice
						</Radio>
						<Radio name={"multipleChoice"} value={true}>
							Multiple Choice
						</Radio>
					</Radio.Group>
				</div>

				<label className={"text-md font-medium"}>
					Alternatives:
				</label>
				<div className={"flex gap-2"}>
					<Input	onKeyPress={e => {e.key === "Enter" && canAddAlternative && addAlternative()}}
						minLength={1} maxLength={64} value={currentAlternativeText}
						   onChange={(e) => setCurrentAlternativeText(e.target.value)} type={"text"}/>
					<Button onClick={addAlternative} disabled={!canAddAlternative} type={"primary"}>Add</Button>
				</div>


				<div className={"text-md font-medium"}>
					Select the correct alternatives:
				</div>
				<div>
					<Select
						value={correctAnswers}
						className={"w-full"}
						mode={multipleChoice ? "multiple" : undefined}
						allowClear={true}
						placeholder={"Please select the correct alternative(s)"}
						options={alternatives.map(label => ({label, value: label}))}
						onChange={(value) => setCorrectAnswers((multipleChoice ? value : [value]) as string[])}
					/>
				</div>
				<div>
					All alternatives: {JSON.stringify(alternatives)}
				</div>
				<div>
					Current correct answers: {JSON.stringify(correctAnswers)}
				</div>
				<div>
					IsValid: {isFormValid ? "true" : "false"}
				</div>

					{isFormValid && (
						<button className={"authPrimaryButton"} type="submit">Add Question</button>
					)}
					{!isFormValid && (
						<Button disabled type={"primary"}>Add Question</Button>
					)}


					{canGoBack && (
						<Button onClick={goBack}>Cancel</Button>
					)}

			</div>
		</form>
	</div>
}

export function QuizBuilder() {
	usePrivatePage();

	let {state, quiz, defineQuizTitle, addQuestionToQuiz, permaLinkId, submitQuiz, page, setPage} = useQuizBuilderViewModel();

	console.log(`State: ${JSON.stringify(state)}`)

	if(page === "done"){
		return <div className={"flex flex-col"}>
			<div className={"pt-12 text-xl"}>
				Quiz created!
			</div>
			<div>Share the link below with your friends so they can play your quiz!</div>
			<div>
				<Link to={`/quiz/${permaLinkId}`}>{`${location.origin}/quiz/${permaLinkId}`}</Link>
			</div>
		</div>
	}


	if (state.requireAddTitle) {
		return <Wrapper quiz={quiz}>
			<DefineQuizTitle onSubmit={defineQuizTitle}/>
		</Wrapper>
	}

	if (state.requireAddQuestion || state.page === "add_question") {
		return <Wrapper quiz={quiz}>
			<AddQuestion
				canGoBack={state.page === "add_question"}
				goBack={() => setPage("display")}
				onSubmit={addQuestionToQuiz}/>
		</Wrapper>
	}


	if (state.readyToSubmit) {
		return <Wrapper quiz={quiz}>
			<div className={"flex flex-col"}>
				<div className={"pt-12 text-xl"}>
					3) Your quiz is ready to submit!
				</div>

				<div className="text-lg py-4">
					Title: <span className={"italic"}>{quiz!.title}</span>
				</div>

				<div className="text-lg">
					 Questions:
				</div>

				<div className={"flex gap-2  py-4 flex-wrap"}>
					{
						quiz!.questions.map((question, i) => (
						<QuestionDisplay question={question} key={i}/>))
					}
				</div>

				<div className={"flex gap-2"}>
					<Button type="primary" onClick={submitQuiz}>Submit Quiz</Button>
					{
						state.canAddQuestion &&
						<Button onClick={()=> setPage("add_question")}>Add new Question</Button>
					}
				</div>

			</div>
		</Wrapper>
	}

	return <div className={"bg-red-500"}>Error</div>


}
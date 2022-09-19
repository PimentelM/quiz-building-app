import {useApi} from "../../../../hooks/useApi";
import {useMatch} from "@tanstack/react-location";
import {useCallback, useEffect, useMemo, useState} from "react";
import {PossibleAnswer, Question, Quiz} from "../../../../domain/models/quiz";
import {Button} from "antd";


function QuizPlayer({quiz}: { quiz: Quiz }) {
	let {api} = useApi()
	let [index, setIndex] = useState(0)
	let question = quiz.questions[index]
	let letters = ["A", "B", "C", "D", "E"]
	let alternativesCount = question.possibleAnswers.length

	let questionCount = quiz.questions.length

	let [selected, setSelected] = useState<Array<boolean>>(new Array(alternativesCount).fill(false))
	let [savedAnswers, setSavedAnswers] = useState<Array<boolean>[]>([])

	let canProceed = selected.find(x => x);

	function nextQuestion() {
		setIndex(i => ++i)
		setSavedAnswers([...savedAnswers, selected])
	}

	useEffect(() => {
		setSelected(new Array(alternativesCount).fill(false))
	}, [index])

	let [isSubmitting, setIsSubmitting] = useState(false)
	function submitQuiz() {
		let answers = savedAnswers

		if(savedAnswers.length < questionCount) {
			answers = [...savedAnswers, selected]
			setSavedAnswers(answers);
		}


		setIsSubmitting(true);
		api.getScore(quiz._id, answers).then(({score}) => {
			setIsSubmitting(false);
			alert(`You got ${score} questions out of ${questionCount} correct!`)
		});



	}


	let toggleAnswer = (i: number) => {
		if (question.multipleChoice) {
			selected[i] = !selected[i]
			setSelected([...selected])
		} else {
			let array = (new Array(alternativesCount).fill(false))
			array[i] = true
			setSelected([...array])
		}
	}


	/* Components */

	function ControlButtons() {
		if (index === quiz.questions.length - 1) {
			return <Button disabled={!canProceed || isSubmitting} className={"w-[130px]"} onClick={submitQuiz}
						   type="primary">Submit</Button>

		} else {
			return <Button disabled={!canProceed} className={"w-[130px]"} onClick={nextQuestion} type="primary">Next
				question</Button>

		}
	}

	function Alternative({i, option}: { i: number, option: PossibleAnswer }) {
		let isSelected = selected[i]
		let letter = letters[i]
		let text = option.text
		let selectedStyle = isSelected ? "bg-blue-500 text-white" : "bg-white text-black"

		return <div  onClick={() => toggleAnswer(i)} key={index}
				style={{height: "50px", borderRadius: "150px"}}
				className={"w-[100%] mb-3 border" + " " + selectedStyle}>
			<div className={"flex justify-between items-center px-3 h-[100%]"}>
				<div>
					<div style={{overflowWrap: "break-word", whiteSpace: "normal"}}
						 className={"max-w-[300px] md:max-w-[400px] lg:max-w-[700px]"}>
						{letter}) {text}
					</div>
				</div>
			</div>
		</div>
	}

	function Alternatives({question}: { question: Question }) {
		return (<div>
			{question.possibleAnswers.map((option, i) => (
				<Alternative key={i} i={i} option={option}/>
			))}
		</div>)
	}

	function TitleAndQuestion() {
		return (
			<div className={"flex justify-between"}>
				<div>
					<div>
						<div className="font-medium text-lg mb-0">
							{quiz.title}
						</div>
						<div className={"text-sm text-gray-500"}>Question {index + 1} of {quiz.questions.length}</div>
					</div>

					<div className={"pt-8 font-sans"}>
						{question.text}
					</div>

				</div>
				<div>
				</div>
			</div>
		)
	}

	function Instruction() {
		return <div>{question.multipleChoice ? "Select all answers that apply" : "Select one answer"}</div>
	}

	function DebugData() {
		return (<div>
			<div className={"flex flex-col"}>
				<div>
					Answer Signature: {JSON.stringify(selected)}
				</div>
				<div>
					All answers: {JSON.stringify(savedAnswers)}
				</div>
			</div>
		</div>)
	}

	return (
		<div style={{fontFamily: "sans-serif"}} className={""}>
			<div className={"flex flex-col md:flex-row justify-between px-4 pt-10"}>

				<div className="w-[100%] px-4 pb-20">
					<TitleAndQuestion/>
				</div>
				<div className={"flex flex-col w-[100%] px-4"}>
					<div className={"flex justify-between"}>
						<div>
							<Instruction/>
						</div>
						<div>
							<ControlButtons/>
						</div>
					</div>

					<div className={"pt-4"}>
						<Alternatives question={question}/>
					</div>
				</div>
			</div>
			<div className={"pb-10 pt-2 pl-4 w-[100%]"}>

				<DebugData/>

			</div>
		</div>
	)
}


export function QuizPage() {
	let {quiz, isLoading, error} = useQuizViewModel();

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return (
			<div className="text-red-500 text-xl">
				{error}
			</div>
		)
	}
	if (quiz)
		return (
			<div>
				<div>
					<QuizPlayer quiz={quiz}/>
				</div>
			</div>
		)

	return null
}


function useQuizViewModel() {
	let {api} = useApi();
	let {params} = useMatch();
	let {quizId} = params;

	let [quiz, setQuiz] = useState<Quiz>();
	let [error, setError] = useState<string>();
	let [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		api.getQuizByPermaLinkId(quizId)
			.then(setQuiz)
			.catch(setError)
			.finally(() => setIsLoading(false));
	}, [])

	return {
		quiz,
		error,
		isLoading
	}
}
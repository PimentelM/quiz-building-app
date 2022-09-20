import {Quiz} from "../dtos";
import {useApi} from "../../../../hooks/useApi";
import {useEffect, useState} from "react";
import {useMatch} from "@tanstack/react-location";

export function useQuizPlayerViewModel(quiz: Quiz){
	let {api} = useApi()
	let [index, setIndex] = useState(0)
	let question = quiz.questions[index]
	let letters = ["A", "B", "C", "D", "E"]
	let alternativesCount = question.possibleAnswers.length

	let questionCount = quiz.questions.length

	let [selected, setSelected] = useState<Array<boolean>>(new Array(alternativesCount).fill(false))
	let [savedAnswers, setSavedAnswers] = useState<Array<boolean>[]>([])

	let canProceed = selected.find(x => x);

	let [score, setScore] = useState(-1)
	let isFinished = score !== -1

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

		if (savedAnswers.length < questionCount) {
			answers = [...savedAnswers, selected]
			setSavedAnswers(answers);
		}


		setIsSubmitting(true);
		api.getScore(quiz._id!, answers).then(({score}) => {
			setIsSubmitting(false);
			setScore(score);
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

	return {
		toggleAnswer,
		nextQuestion,
		submitQuiz,
		question,
		alternativesCount,
		letters,
		selected,
		canProceed,
		questionCount,
		index,
		isSubmitting,
		score,
		isFinished,
		savedAnswers
	}

}

export function useQuizPageViewModel() {
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

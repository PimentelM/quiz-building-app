import {useApi} from "../../../../hooks/useApi";
import {useEffect, useState} from "react";
import {QuizListElement} from "../dtos";
import {useNavigate} from "@tanstack/react-location";

export function useQuizListElementViewModel(quiz: QuizListElement, onDelete?: ()=>void){
	let navigate = useNavigate()
	let {api} = useApi()

	let [isDeleting, setIsDeleting] = useState(false)

	function deleteQuiz(){
		if(isDeleting) return;

		let doDelete = confirm("Are you sure you want to delete this quiz? This action cannot be undone.")
		if(!doDelete) return;

		api.deleteQuiz(quiz._id!).then(()=>{
			console.log("Deleted quiz")
			onDelete?.()
		}).catch((error)=>{
			alert(error.message)
		}).finally(()=>{
			setIsDeleting(false)
		})
	}

	function visitQuiz(){
		navigate({to:`/quiz/${quiz.permaLinkId}`})
	}

	return {
		deleteQuiz,
		visitQuiz,
		isDeleting,

	}
}

export function useQuizListViewModel() {
	let {api} = useApi()
	let [quizes, setQuizes] = useState<QuizListElement[]>([])
	let [isLoading, setIsLoading] = useState(true)
	let [error, setError] = useState<string>()

	useEffect(() => {
		setIsLoading(true)
		api.listQuizes().then((quizes) => {
			setQuizes(quizes)
		}).catch((error) => {
			setError(error)
		}).finally(()=>{
			setIsLoading(false)
		})
	},[])

	return {
		quizes,
		isLoading,
		error,
		setQuizes
	}

}

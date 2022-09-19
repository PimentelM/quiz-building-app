import {usePrivatePage} from "../../../../hooks/usePrivatePage";
import {Card, Grid, Row} from "antd";
import {QuizListElement} from "../dtos";
import {useApi} from "../../../../hooks/useApi";
import {useEffect, useState} from "react";
import {useNavigate} from "@tanstack/react-location";
import config from "tailwindcss/defaultConfig";


function QuizListElementDisplay({quiz, onDelete}: { quiz: QuizListElement, onDelete?: () => void }) {
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

	return <div className={"w-[240px] min-h-[120px] mx-2 my-4 px-4 py-4 border flex flex-col"}>
		<div className={"font-medium text-lg"}>
			{quiz.title}
		</div>
		<div className={"text-gray-600"}>
			Number of questions: {quiz.questionCount}
		</div>
		<div className={"flex pt-4 gap-4 font-mono underline"}>
			<div className={"cursor-pointer hover:text-blue-500"}
				onClick={visitQuiz}>
				Visit
			</div>
			<div className={"cursor-pointer hover:text-blue-500"}
				onClick={deleteQuiz}>
				Delete
			</div>
		</div>

	</div>
}

function ListQuizes({quizes, setQuizes} : {quizes: QuizListElement[], setQuizes: (quizes: QuizListElement[]) => void}) {

	function removeQuiz(index: number){
		let result = [...quizes]
		result.splice(index,1);
		setQuizes(result)
	}

	return <div className={"flex flex-wrap mt-4"}>
			{quizes.map((quiz,i) => <QuizListElementDisplay onDelete={()=> removeQuiz(i)} key={quiz._id} quiz={quiz}/>)}
	</div>


}
function useQuizListViewModel() {
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

export function Home(){
	usePrivatePage();

	let {quizes, isLoading, error, setQuizes} = useQuizListViewModel();

	  return (
		  <div className={"flex flex-col px-8 py-10"}>
			  <div className={"text-2xl "}>
				  My List of Quizes
			  </div>
			  <div>
				  {isLoading && <div>Loading...</div>}
				  {error && <div className={"text-red-500"}>{error}</div>}
				  {quizes && <ListQuizes setQuizes={setQuizes} quizes={quizes}/>}
			  </div>
		  </div>
	  );
}
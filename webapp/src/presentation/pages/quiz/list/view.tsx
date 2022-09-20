import {usePrivatePage} from "../../../../hooks/usePrivatePage";
import {QuizListElement} from "../dtos";
import {useQuizListElementViewModel, useQuizListViewModel} from "./viewModel";


function QuizListElementDisplay({quiz, onDelete}: { quiz: QuizListElement, onDelete?: () => void }) {

	let {visitQuiz, deleteQuiz} = useQuizListElementViewModel(quiz, onDelete);

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
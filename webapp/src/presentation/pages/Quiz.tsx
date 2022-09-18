import {useApi} from "../../hooks/useApi";
import {useMatch} from "@tanstack/react-location";
import {useEffect, useState} from "react";



export function Quiz() {
	let {api} = useApi();
	let {params} = useMatch();
	let {quizId} = params;

	let [quizData, setQuizData] = useState("")
	let [error, setError] = useState("")

	function Error(){
		if(error){
			return (
				<div className="text-red-500 text-xl">
					{error}
				</div>
			)
		} else return <div></div>
	}

	useEffect(() => {
		api.getQuizByPermaLinkId(quizId).then((data) => {
			setQuizData(JSON.stringify(data, null, 2))
		}).catch((err) => {
			setError(err.message || "Something went wrong")
		});
	},[]);

	return (
		<div>
			<div>Quiz Player</div>
			<div>
				<pre>{quizData}</pre>
				<Error/>
			</div>
		</div>

	)
}
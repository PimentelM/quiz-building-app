import {useApi} from "../../../../hooks/useApi";
import {useState} from "react";
import {useMatch} from "@tanstack/react-location";

export function useResetPasswordViewModel(){
	let {api} = useApi()

	let [error, setError] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	let [successMessage, setSuccessMessage] = useState("")

	let query = useMatch().search;

	function handleSubmit(e: any) {
		console.log(`clicked...`)
		e.preventDefault();

		let formData = new FormData(e.target);

		let password = formData.get("password")
		let {token} = query;

		console.log(password, token)

		setIsLoading(true)
		setError("")
		api.resetPassword(token as string, password as string).then(
			data=>{
				setSuccessMessage(data.message)
				console.log("reset-password success")
			}
		).catch(error=>{
			setError(error.message)
			setSuccessMessage("")
		}).finally(()=>{
			setIsLoading(false)
		})
	}

	return {
		error,
		isLoading,
		handleSubmit,
		successMessage
	}


}


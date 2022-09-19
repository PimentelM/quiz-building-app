import {useApi} from "../../../../hooks/useApi";
import {useState} from "react";

export function useForgotPasswordViewModel(){
	let {api} = useApi()

	let [error, setError] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	let [successMessage, setSuccessMessage] = useState("")

	function handleSubmit(e: any) {
		console.log(`clicked...`)
		e.preventDefault();

		let formData = new FormData(e.target);

		let email = formData.get("email")

		console.log(email)

		setIsLoading(true)
		setError("")
		api.sendPasswordResetEmail(email as string).then(
			data=>{
				setSuccessMessage(data.message)
				console.log("sent reset email success")
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



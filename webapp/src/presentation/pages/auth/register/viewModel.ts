import {useApi} from "../../../../hooks/useApi";
import {useState} from "react";

export function useRegisterViewModel(){
	let {api} = useApi()

	let [error, setError] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	let [successMessage, setSuccessMessage] = useState("")

	function handleSubmit(e: any) {
		console.log(`clicked...`)
		e.preventDefault();

		let formData = new FormData(e.target);

		let email = formData.get("email")
		let password = formData.get("password")

		console.log(email, password)

		setIsLoading(true)
		setError("")
		api.register(email as string, password as string).then(
			data=>{
				setSuccessMessage(data.message)
				console.log("register success")
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


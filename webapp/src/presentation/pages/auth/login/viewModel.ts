import {useApi} from "../../../../hooks/useApi";
import {useAuth} from "../../../../hooks/useAuth";
import {useState} from "react";
import {useNavigate} from "@tanstack/react-location";


export function useLoginForm(){
	let {api} = useApi()
	let {storeToken} = useAuth()

	let [error, setError] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	let navigate = useNavigate()

	function handleSubmit(e: any) {
		console.log(`clicked...`)
		e.preventDefault();


		let formData = new FormData(e.target);

		let email = formData.get("email")
		let password = formData.get("password")
		let rememberMe = formData.get("rememberMe") === "on"

		console.log(email, password, rememberMe)

		setIsLoading(true)
		setError("")
		api.login(email as string, password as string).then(
			data=>{
				storeToken(data.token, rememberMe)
				console.log("login success")
				navigate({to: "/"})
			}
		).catch(error=>{
			setError(error.message)
		}).finally(()=>{
			setIsLoading(false)
		})
	}

	return {
		error,
		isLoading,
		handleSubmit
	}


}
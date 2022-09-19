import {useApi} from "../../../../hooks/useApi";
import {useAuth} from "../../../../hooks/useAuth";
import {useEffect, useState} from "react";
import {useMatch, useNavigate} from "@tanstack/react-location";


export function useLoginViewModel(){
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




export function useActivateAccountViewModel(){
	let {api} = useApi()

	let [error, setError] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	let [successMessage, setSuccessMessage] = useState("")

	let query = useMatch().search;
	let token = query.token;

	useEffect(()=>{
		if(!token) {
			setError("Token is missing")
			return
		}
		console.log("Activating account...")
		setIsLoading(true)
		setError("")
		api.activateAccount(token as string).then(
			data=>{
				setSuccessMessage(data.message)
				console.log("activation success")
			}
		).catch(error=>{
			setError(error.message)
			setSuccessMessage("")
		}).finally(()=>{
			setIsLoading(false)
		})
	},[token]);

	return {
		error,
		isLoading,
		successMessage
	}


}


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


export function useResendVerificationEmailViewModel(){
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
		api.resendActivationEmail(email as string).then(
			data=>{
				setSuccessMessage(data.message)
				console.log(data.message)
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




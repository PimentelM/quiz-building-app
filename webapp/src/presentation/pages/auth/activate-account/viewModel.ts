import {useApi} from "../../../../hooks/useApi";
import {useEffect, useState} from "react";
import {useMatch} from "@tanstack/react-location";

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


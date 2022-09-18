import {useNavigate} from "@tanstack/react-location";
import {useAuth} from "./useAuth";
import {useEffect} from "react";


export function usePrivatePage(){
	const {isAuthenticated} = useAuth()

	const navigate = useNavigate()

	useEffect(() => {
		if(!isAuthenticated){
			navigate({to: "/login"})
		}
	},[])
}
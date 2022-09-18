import {useNavigate} from "@tanstack/react-location";
import {useAuth} from "./useAuth";
import {useEffect} from "react";


export function usePrivatePage(){
	const {token} = useAuth()

	const navigate = useNavigate()

	useEffect(() => {
		if(!token){
			navigate({to: "/login"})
		}
	},[])
}
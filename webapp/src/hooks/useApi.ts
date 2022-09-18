import {useMemo} from "react";
import {useAuth} from "./useAuth";
import axios, {AxiosError, AxiosInstance} from "axios";

function handleRequestError(error: AxiosError) {
	if (error.response) {
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
	} else if (error.request) {
		console.log(error.request);
	} else {
		console.log('Error', error.message);
	}
	console.log(error.config);

	let responseData: any = error.response?.data

	throw new Error(responseData.message || error.message);
}

class Api {
	private http: AxiosInstance;
	constructor(private token: string) {
		this.http = axios.create({
			baseURL: "http://localhost:8081/api",
			headers: {
				Authorization: `Bearer ${token}`,
			}
		})
	}

	async getQuizByPermaLinkId(permaLinkId: string) {
		let response = await this.http.get(`/quiz/by-permalink-id/${permaLinkId}`).catch(
			handleRequestError
		);

		return response?.data;
	}

}

export function useApi(){
	const {token} = useAuth()

	const api = useMemo(()=>{
		return new Api(token);
	},[token])


	return {
		api
	}

}
import axios, {AxiosError, AxiosInstance} from "axios";
import React, {useState, useContext, createContext, useEffect, useMemo} from "react";
import {useAuth} from "./useAuth";
import {Quiz} from "../presentation/pages/quiz/dtos";

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
	constructor(private token?: string) {
		let headers: any = {};

		if(token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		this.http = axios.create({
			baseURL: "http://localhost:8081/api",
			headers
		})
	}

	async getQuizByPermaLinkId(permaLinkId: string) {
		let response = await this.http.get(`/quiz/by-permalink-id/${permaLinkId}`).catch(
			handleRequestError
		);

		return response?.data;
	}

	async login(email: string, password: string) {
		let response = await this.http.post("/auth/login", {email, password}).catch(
			handleRequestError
		);

		return response?.data;
	}

	async register(email: string, password: string) {
		let response = await this.http.post("/auth/register", {email, password}).catch(
			handleRequestError
		);

		return response?.data;
	}

	async activateAccount(token: string) {
		let response = await this.http.post("/auth/activate-account", {token}).catch(
			handleRequestError
		);

		return response?.data;
	}
	async sendPasswordResetEmail(email: string) {
		let response = await this.http.post("/auth/send-reset-password-email", {email}).catch(
			handleRequestError
		);

		return response?.data;
	}
	
	async resetPassword(token: string, password: string) {
		let response = await this.http.post("/auth/reset-password", {token, password}).catch(
			handleRequestError
		);

		return response?.data;
	}

	async resendActivationEmail(email: string) {
		let response = await this.http.post("/auth/resend-activation-email", {email}).catch(
			handleRequestError
		);

		return response?.data;
	}

	async getScore(_id: string, savedAnswers: Array<boolean>[]) : Promise<{ score: number }> {
		let response = await this.http.post(`/quiz/${_id}/compute-score`, {
			answers: savedAnswers
		}).catch(
			handleRequestError
		);

		return response?.data;
	}

	async listQuizes() {
		let response = await this.http.get("/quiz").catch(
			handleRequestError
		);

		return response?.data;
	}

	async deleteQuiz(_id: string) {
		let response = await this.http.delete(`/quiz/${_id}`).catch(
			handleRequestError
		);

		return response?.data;
	}

	async createQuiz(quiz: Quiz) {
		let response = await this.http.post("/quiz", quiz).catch(
			handleRequestError
		);

		return response?.data;
	}

}



interface ApiContextProps {
	api: Api;
}

const apiContext = createContext<ApiContextProps>({} as ApiContextProps);
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideApi({ children } : any) {
	const api = useProvideApi();
	return <apiContext.Provider value={api}>{children}</apiContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useApi = () => {
	return useContext(apiContext);
};

// Provider hook that creates auth object and handles state
function useProvideApi() {
	const {token} = useAuth()

	const api = useMemo(()=>{
		return new Api(token);
	},[token])

	return {
		api
	}
}
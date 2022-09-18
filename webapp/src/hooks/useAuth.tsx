import React, {useState, useContext, createContext, useEffect} from "react";

interface AuthContextProps {
	token: string;
	storeToken: (token: string) => void;
	clearToken: () => void;
}

const authContext = createContext<AuthContextProps>({} as AuthContextProps);
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children } : any) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
	return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
	const [token, setToken] = useState( "");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
		}
	});

	const storeToken = (newToken: string) => {
		console.log("storeToken", newToken);
		localStorage.setItem("token", newToken);
		return setToken(newToken);
	};
	const clearToken = () => {
		console.log("clearToken");
		localStorage.removeItem("token");
		return setToken("");
	};

	// Return the user object and auth methods
	return {
		storeToken,
		clearToken,
		token,
	};
}
import {AsyncLocalStorage} from "async_hooks";
import {NextFunction, Request, Response} from "express";

const state : any = {
	asyncLocalStorage: null
}

const getAsyncLocalStorage = () : AsyncLocalStorage<RequestContextStore> => {
	if (state.asyncLocalStorage) {
		return state.asyncLocalStorage
	}

	state.asyncLocalStorage = new AsyncLocalStorage()
	return state.asyncLocalStorage
}

export interface RequestContextStore {
	userId?: string
	[key: string]: any
}

export const requestScopedContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
	getAsyncLocalStorage().run({
	}, () => next())
}

export const getRequestContext = () : RequestContextStore => {
	const store = getAsyncLocalStorage().getStore();

	if(!store) {
		throw new Error("Cannot access the RequestContext outside of a request call stack")
	}

	return store
}


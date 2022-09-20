export class InvalidInputError extends Error implements IAppError {
	public readonly name = "InvalidInputError";
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 400;

	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends Error implements IAppError {
	public readonly name = "NotFoundError";
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 404;

	constructor(message: string) {
		super(message);
	}
}

export class AppError extends Error implements IAppError {
	public readonly name = "AppError";
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 500;

	constructor(message: string) {
		super(message);
	}
}

interface IAppError {
	__isApplicationError: true
	httpStatuscode: number
}
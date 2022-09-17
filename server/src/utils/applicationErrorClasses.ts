
export class InvalidInputError extends Error {
	public readonly name = "InvalidInputError";
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 400;

	constructor(message: string) {
		super(message);
	}
}

export class AppError extends Error {
	public readonly name = "AppError";
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 500;

	constructor(message: string) {
		super(message);
	}
}


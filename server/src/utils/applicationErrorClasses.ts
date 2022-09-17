
export class InvalidInputError extends Error {
	public readonly __isApplicationError = true;
	public readonly httpStatuscode: number = 404;
	public readonly description: string = "The input provided was invalid";

	constructor(message: string) {
		super(message);
	}
}

export async function handlePromise<T = any, E extends Error = any>(
	promise: Promise<T>,
): Promise<[result: T, error: null] | [result: null, error: E]> {
	try {
		const result = await promise;
		return [result, null];
	} catch (error) {
		return [null, error as E];
	}
}
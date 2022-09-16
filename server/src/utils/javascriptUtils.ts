export function makeObjectIterable(object) {
	return {
		...object,
		// Transforms object in a iterable
		[Symbol.iterator]: function* () {
			for (const key in this) {
				yield this[key];
			}
		},
	};
}

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
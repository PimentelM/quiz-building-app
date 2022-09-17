import {QuizCreationData} from "../factories/quiz";

export function getValidQuizCreationData(orverwrites?: Partial<QuizCreationData>): QuizCreationData {
	return {
		//_id: getUniqueId(),
		//ownerId: getUniqueId(),
		//permaLinkId: getPermaLinkId(),
		title: "title",
		questions: [
			{
				text: "text",
				multipleChoice: false,
				possibleAnswers: [
					{
						text: "text",
						isCorrect: true,
					},
					{
						text: "text2",
						isCorrect: false,
					}
				],
			},
		],
		...orverwrites,
	};
}

export function getValidAuthToken(userId: string){
	return `${userId}`;
}
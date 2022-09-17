import {PossibleAnswer, Question} from "../../models/quiz";


describe("Quiz Models", () => {

	describe("Question", () => {

		it("Should not be able to create a question with no possible answers", () => {
			let action = () => new Question("1 + 1 = ?", false,[])

			expect(action).toThrowError();
		});

	});


})
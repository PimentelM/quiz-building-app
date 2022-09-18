import {PossibleAnswer, Question} from "../../models/quiz";


describe("Quiz Models", () => {

	describe("Question", () => {

		it("Should not be able to create a question with no possible answers", () => {
			let action = () => new Question("1 + 1 = ?", false,[])

			expect(action).toThrowError();
		});

		it("Should have at lest one correct answer", () => {
			let action = () => new Question("1 + 1 = ?", false,[
				new PossibleAnswer("2", false),
				new PossibleAnswer("3", false),
			])

			expect(action).toThrowError();
		});

	});


})
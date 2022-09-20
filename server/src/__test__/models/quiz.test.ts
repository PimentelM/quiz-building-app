import {PossibleAnswer, Question, Quiz} from "../../models/quiz";


describe("Quiz Models", () => {

	describe("Question", () => {

		it("Should not be able to create a question with no possible answers", () => {
			let action = () => new Question("1 + 1 = ?", false, [])

			expect(action).toThrowError();
		});

		it("Should have at lest one correct answer", () => {
			let action = () => new Question("1 + 1 = ?", false, [
				new PossibleAnswer("4", false),
				new PossibleAnswer("3", false),
			])

			expect(action).toThrowError();
		});

		it("Should not be able to create a single answer question with more than one correct answer", () => {
			let action = () => new Question("1 + 1 = ?", false, [
				new PossibleAnswer("2", true),
				new PossibleAnswer("2", true),
			])

			expect(action).toThrowError();
		});

		it("Should not be able to create a question with more than 5 possible answers", () => {
			let action = () => new Question("1 + 1 = ?", false, [
				new PossibleAnswer("1", false),
				new PossibleAnswer("2", true),
				new PossibleAnswer("3", false),
				new PossibleAnswer("4", false),
				new PossibleAnswer("5", false),
				new PossibleAnswer("6", false),
			])

			expect(action).toThrowError();
		});

	});


	describe("Quiz", () => {

		it("Should not be able to create a quiz with no questions", () => {
			let action = () => new Quiz("123", "123456", "123123", "My Quiz", []);

			expect(action).toThrowError();
		})

		it("Should not be able to create a quiz with more than 10 questions", () => {
			let question = new Question("1 + 1 = ?", false, [new PossibleAnswer("2", true)]);

			let action = () => new Quiz("123", "123456", "123123", "My Quiz", new Array(11).fill(question));

			expect(action).toThrowError();
		});

	})

})
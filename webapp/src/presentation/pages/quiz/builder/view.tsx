import {usePrivatePage} from "../../../../hooks/usePrivatePage";
import { Question, Quiz} from "../dtos";
import { Button, Input, Radio, Select} from "antd";
import {DeleteOutlined, EditFilled, EditOutlined} from "@ant-design/icons";
import {Link} from "@tanstack/react-location";
import CopyToClipboard from "react-copy-to-clipboard";
import {addQuestionViewModel, useQuizBuilderViewModel} from "./viewModel";

function DefineQuizTitle({onSubmit}: { onSubmit: (title: string) => void }) {

	function handleSubmit(e: any) {
		e.preventDefault();
		onSubmit(e.target.title.value)
	}


	return <div className={"flex flex-col"}>
		<div className={"pt-12 text-xl"}>
			1) Please, define the quiz title:
		</div>
		<form onSubmit={handleSubmit}>
			<div className={"flex flex-col gap-2"}>
				<Input required minLength={3} maxLength={64} name="title" type={"text"}/>
				<button className={"authPrimaryButton"} type="submit">Send</button>
			</div>
		</form>
	</div>
}

function AddQuestion({onSubmit, canGoBack, goBack}: { canGoBack: boolean, goBack: ()=>void ,onSubmit: (question: Question, answerSignature: boolean[]) => void }) {

	let {
		handleMultipleChoiceChange,
		setCurrentAlternativeText,
		setCorrectAnswers,
		deleteAlternative,
		addAlternative,
		handleSubmit,
		setText,
		multipleChoice,
		alternatives,
		correctAnswers,
		currentAlternativeText,
		canAddAlternative,
		isFormValid,
	} = addQuestionViewModel(canGoBack, goBack, onSubmit)

	function AddQuestionDebugInfo(){
		return <div>

			<div>
				All alternatives: {JSON.stringify(alternatives)}
			</div>
			<div>
				Current correct answers: {JSON.stringify(correctAnswers)}
			</div>
			<div>
				IsValid: {isFormValid ? "true" : "false"}
			</div>
		</div>;
	}


	return <div className={"flex flex-col"}>
		<div className={"pt-12 text-xl"}>
			2) Now add a question:
		</div>
		<form>
			<div className={"flex flex-col gap-2"}>
				<Input onChange={e => setText(e.target.value)} placeholder={"Question text"} required minLength={3}
					   maxLength={64} name="text"/>

				<div className={"text-md font-medium"}>
					Type:
				</div>

				<div className={"text-md font-medium"}>
					<Radio.Group defaultValue={false}
								 onChange={handleMultipleChoiceChange}>

						<Radio name={"multipleChoice"} value={false}>
							Single Choice
						</Radio>
						<Radio name={"multipleChoice"} value={true}>
							Multiple Choice
						</Radio>
					</Radio.Group>
				</div>

				<label className={"text-md font-medium"}>
					Alternatives:
				</label>
				<div className={"flex gap-2"}>
					<Input	onKeyPress={e => {e.key === "Enter" && canAddAlternative && addAlternative()}}
						minLength={1} maxLength={64} value={currentAlternativeText}
						   onChange={(e) => setCurrentAlternativeText(e.target.value)} type={"text"}/>
					<Button onClick={addAlternative} disabled={!canAddAlternative} type={"primary"}>Add</Button>
				</div>

				<div>
					{alternatives.map((alternative, i) =>
						<div key={i} className={"flex gap-2"}>
							<div onClick={()=>deleteAlternative(i)} className="cursor-pointer">
								<DeleteOutlined />
							</div>
							<div className="">
								{alternative}
							</div>

						</div>
					)}
				</div>


				<div className={"text-md font-medium"}>
					Select the correct alternatives:
				</div>
				<div>
					<Select
						value={correctAnswers}
						className={"w-full"}
						mode={multipleChoice ? "multiple" : undefined}
						allowClear={true}
						placeholder={"Please select the correct alternative(s)"}
						options={alternatives.map(label => ({label, value: label}))}
						onChange={(value) => setCorrectAnswers((multipleChoice ? value : [value]) as string[])}
					/>
				</div>
				     <Button onClick={handleSubmit} disabled={!isFormValid} type={"primary"}>Add Question</Button>

					{canGoBack && (
						<Button onClick={goBack}>Cancel</Button>
					)}

				<AddQuestionDebugInfo/>

			</div>
		</form>
	</div>
}

export function QuizBuilder() {
	usePrivatePage();

	let {state, quiz, defineQuizTitle, addQuestionToQuiz, deleteQuestionFromQuiz, showEditTitle, setShowEditTitle, permaLinkId, submitQuiz, page, setPage} = useQuizBuilderViewModel();

	console.log(`State: ${JSON.stringify(state)}`)

	if(page === "done"){
		return <div className={"flex flex-col items-center"}>
			<div className={"pt-12 text-4xl"}>
				Quiz created!
			</div>
			<div className={"text-md pt-12"}>Share the link below with your friends so they can play your quiz!</div>
			<div>
				<Link to={`/quiz/${permaLinkId}`} className={"text-blue-400 underline"}>
					{`${location.origin}/quiz/${permaLinkId}`}
				</Link>
			</div>

			<div className={"pt-4"}>
				<CopyToClipboard text={`${location.origin}/quiz/${permaLinkId}`}>
					<Button type={"primary"}>Copy link</Button>
				</CopyToClipboard>
			</div>
		</div>
	}


	if (state.requireAddTitle) {
		return <Wrapper quiz={quiz}>
			<DefineQuizTitle onSubmit={defineQuizTitle}/>
		</Wrapper>
	}

	if (state.requireAddQuestion || state.page === "add_question") {
		return <Wrapper quiz={quiz}>
			<AddQuestion
				canGoBack={state.page === "add_question"}
				goBack={() => setPage("display")}
				onSubmit={addQuestionToQuiz}/>
		</Wrapper>
	}


	if (state.readyToSubmit) {
		return <MainPage/>
	}

	return <div className={"bg-red-500"}>Error</div>


	function MainPage() {
		return <Wrapper quiz={quiz}>
			<div className={"flex flex-col"}>
				<div className={"pt-12 text-xl"}>
					3) Your quiz is ready to submit!
				</div>

				<div className="text-lg py-4">
					<div className="flex gap-2 items-center">
						<div>
							Title: {quiz!.title}
						</div>
						<div className={"pb-1"}>
							<EditOutlined onClick={()=>setShowEditTitle(!showEditTitle)}/>
						</div>
					</div>
					{showEditTitle && (
						<div>
							<Input
								onBlur={(e)=>(defineQuizTitle(e.target.value))}
								onKeyPress={(e)=>{e.key === "Enter" && defineQuizTitle(e.currentTarget.value)}}
								placeholder={"Please define the new quiz title"}/>
						</div>
					)}
				</div>


				<div className="text-lg">
					Questions:
				</div>

				<div className={"flex gap-2  py-4 flex-wrap"}>
					{
						quiz!.questions.map((question, i) => (
							<QuestionDisplay
								deleteQuiz={()=>deleteQuestionFromQuiz(i)}
								canDelete={state.canDeleteQuestion}
								question={question} key={i}/>))
					}
				</div>

				<div className={"flex gap-2"}>
					<Button type="primary" onClick={submitQuiz}>Submit Quiz</Button>
					{
						state.canAddQuestion &&
                        <Button onClick={()=> setPage("add_question")}>Add new Question</Button>
					}
				</div>

			</div>
		</Wrapper>
	}


}


function QuestionDisplay({question, canDelete, deleteQuiz} : {question: Question, canDelete: boolean, deleteQuiz: () => void}) {
	let correctAnswers = question.possibleAnswers.filter(x => x.isCorrect).map(x => x.text)

	function handleDeleteClick(){
		if(window.confirm("Are you sure you want to delete this question?")) {
			deleteQuiz();
		}
	}

	return <div className={"w-[240px] min-h-[120px] px-4 py-4 border flex flex-col"}>
		<div className={"font-medium text-lg"}>
			{question.text}
		</div>
		<div className={"text-gray-600"}>
			{question.multipleChoice ? "Multiple choice" : "Single choice"}
		</div>
		<div>
			{question.multipleChoice ? "Correct answers: " : "Correct answer: "}
		</div>
		<div className={"flex flex-col"}>
			{correctAnswers.map((x, i) =>
				<div key={i} style={{overflowWrap: "break-word"}} className={"text-gray-600 "}> {x}</div>
			)}
		</div>
		<div className="flex-grow"></div>
		<div className={"justify-end flex"}>
			<div>
				{canDelete && <DeleteOutlined onClick={handleDeleteClick} className={"cursor-pointer hover:text-red-500"}/>}
			</div>
		</div>
	</div>
}


function Wrapper({children, quiz}: { children: any, quiz: Quiz | null }) {
	return <div className={"w-[100%] pt-4"}>
		<div className={"flex flex-col"}>
			<div className={"flex justify-center"}>
				<div className={"text-2xl"}>
					Quiz Builder
				</div>
			</div>

			<div>
				<div className={"w-[80vw] m-auto"}>
					{children}
				</div>
			</div>

			{/*Quiz Preview*/}
			<div className={"w-[50vw] bg-gray-50 m-auto mt-10"}>
				<pre>{JSON.stringify(quiz, null, 2)}</pre>
			</div>
		</div>
	</div>

}

import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";
import {useForgotPasswordViewModel} from "./viewModel";

export function ForgotPasswordPage() {
	return (
		<AuthCard>
			<ForgotPasswordForm/>
		</AuthCard>
	)
}

function ForgotPasswordForm() {

	let {error, isLoading, handleSubmit, successMessage} = useForgotPasswordViewModel()

	if (successMessage) {
		return (<MessageDisplay message={successMessage}/>)
	}

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium">
					Forgot Password
				</div>

			</div>


			<ErrorDisplay error={error}/>

			<div className="mb-6">
				<input
					required={true}
					name="email"
					type="email"
					className="authInput"
					id="login-email"
					placeholder="Email address"
				/>
			</div>

			<div className="text-center lg:text-left">
				<button
					type="submit"
					className={"authPrimaryButton"}
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Send Reset Password Email"}
				</button>
			</div>
		</form>
	)
}


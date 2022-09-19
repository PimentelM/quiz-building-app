import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";
import {useResendVerificationEmailViewModel} from "./viewModel";

export function ResendEmailVerificationPage() {
	return (
		<AuthCard>
			<ResendEmailVerificationForm/>
		</AuthCard>
	)
}


function ResendEmailVerificationForm() {

	let {error, isLoading, handleSubmit, successMessage} = useResendVerificationEmailViewModel()

	if (successMessage) {
		return (<MessageDisplay message={successMessage}/>)
	}

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium text-lg">
					Resend Verification Email
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
					style={{width: "100%"}}

					type="submit"
					className={"authPrimaryButton"}
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Resend Verification Email"}
				</button>
			</div>
		</form>
	)
}

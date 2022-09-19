import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";
import {useResetPasswordViewModel} from "./viewModel";

function ResetPasswordForm() {

	let {error, isLoading, handleSubmit, successMessage} = useResetPasswordViewModel()

	if (successMessage) {
		return (<MessageDisplay message={successMessage}/>)
	}

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium text-lg">
					Reset Password
				</div>

			</div>


			<ErrorDisplay error={error}/>

			<div className="mb-6">
				<input
					required={true}
					name="password"
					type="password"
					className="authInput"
					id="login-password"
					placeholder="Password"
					minLength={8}
				/>
			</div>

			<div className="text-center lg:text-left">
				<button
					style={{width: "100%"}}
					type="submit"
					className={"authPrimaryButton"}
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Reset Password"}
				</button>
			</div>
		</form>
	)
}

export function ResetPasswordPage() {
	return (
		<AuthCard>
			<ResetPasswordForm/>
		</AuthCard>
	)
}


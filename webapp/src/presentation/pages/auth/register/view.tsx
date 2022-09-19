import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";
import {Link} from "@tanstack/react-location";
import {useRegisterViewModel} from "./viewModel";

function RegisterForm() {

	let {error, isLoading, handleSubmit, successMessage} = useRegisterViewModel()

	if (successMessage) {
		return (<MessageDisplay message={successMessage}/>)
	}

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium text-lg">
					Register
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
					type="submit"
					style={{width: "100%"}}
					className={"authPrimaryButton"}
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Register"}
				</button>
			</div>
			<div className="flex flex-col items-center">
				<Link to="/forgot-password">
					<p className="text-black text-sm font-semibold mt-2 pt-1 mb-0">
						Forgot password?
					</p>
				</Link>
				<Link to="/resend-verification">
					<p className="text-black text-sm font-semibold mt-2 pt-1 mb-0">
						Resend verification email
					</p>
				</Link>
				<Link to="/login">
					<p className="text-black text-sm font-semibold mt-2 pt-1 mb-0">
						Already have an account?
					</p>
				</Link>
			</div>
		</form>
	)
}



export function RegisterPage() {
	return (
		<AuthCard>
			<RegisterForm/>
		</AuthCard>
	)
}

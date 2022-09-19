import {Link} from "@tanstack/react-location"
import {
	useLoginViewModel,
} from "./viewModel";
import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";

function LoginForm() {

	let {error, isLoading, handleSubmit} = useLoginViewModel()

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium text-lg">
					Login
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

			<div className="flex justify-between items-center mb-6">
				<div className="form-group form-check">
					<input
						type="checkbox"
						className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
						name="rememberMe"
						id="login-rememberMe"
					/>
					<label className="form-check-label inline-block text-gray-800" htmlFor="exampleCheck2"
					>Remember me</label
					>
				</div>
			</div>

			<div className="text-center lg:text-left">
				<button
					style={{width: "100%"}}
					type="submit"
					className={"authPrimaryButton"}
					value="Login"
					disabled={isLoading}

				>
					{isLoading ? "Loading..." : "Login"}
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
				<Link to="/register">
					<p className="text-black text-sm font-semibold mt-2 pt-1 mb-0">
						Don't have an account?
					</p>
				</Link>
			</div>
		</form>
	)
}

export function LoginPage() {
	return (
		<AuthCard>
			<LoginForm/>
		</AuthCard>
	)
}


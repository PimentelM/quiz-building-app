import {Link, useNavigate} from "@tanstack/react-location"
import {useLoginForm} from "./viewModel";

function LoginForm() {
	
	let {error, isLoading, handleSubmit} = useLoginForm()

	return (
		<form
			onSubmit={handleSubmit}
		>

			{
				(error) && (
					<div className="text-red-400">
						{error}
					</div>
				)
			}

			<div className="mb-6">
				<input
					name="email"
					type="email"
					className="authInput"
					id="login-email"
					placeholder="Email address"
				/>
			</div>

			<div className="mb-6">
				<input
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
					type="submit"
					className={"authPrimaryButton"}
					value="Login"
					disabled={isLoading}

				>
					{isLoading ? "Loading..." : "Login"}
				</button>
			</div>
		</form>
	)
}

function LoginCard() {
	return (
		<div className="px-6 pt-8 h-full text-gray-800">
			<div
				className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
			>
				<div
					className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
				>
					<img
						src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
						className="w-full"
						alt="Sample image"
					/>
				</div>
				<div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
					<LoginForm></LoginForm>
					<div className="flex flex-col items-center">
						<Link to="/forgot-password">
							<p className="text-sm font-semibold mt-2 pt-1 mb-0">
								Forgot password?
							</p>
						</Link>
						<Link to="/resend-verification">
							<p className="text-sm font-semibold mt-2 pt-1 mb-0">
								Resend verification email
							</p>
						</Link>
						<Link to="/register">
							<p className="text-sm font-semibold mt-2 pt-1 mb-0">
								Don't have an account?
							</p>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export function LoginPage() {

	return (
		<div className="flex justify-center items-center h-[100%]">
			<LoginCard/>
		</div>
	)
}

export function RegisterPage() {
	return (
		<div>
			<h1>Register</h1>
		</div>
	)
}

export function ForgotPasswordPage() {
	return (
		<div>
			<h1>Forgot Password</h1>
		</div>)
}

export function ResetPasswordPage() {
	return (
		<div>
			<h1>Reset Password</h1>
		</div>)
}

export function VerifyEmailPage() {
	return (
		<div>
			<h1>Verify Email</h1>
		</div>)
}



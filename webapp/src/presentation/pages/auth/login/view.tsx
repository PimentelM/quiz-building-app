import {Link} from "@tanstack/react-location"
import {
	useActivateAccountViewModel,
	useLoginViewModel,
	useRegisterViewModel,
	useForgotPasswordViewModel
} from "./viewModel";

function LoginForm() {

	let {error, isLoading, handleSubmit} = useLoginViewModel()

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div className={"flex justify-center"}>
				<div className="pb-4 font-medium">
					Login
				</div>

			</div>

			<ErrorDisplay error={error}/>

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
		</form>
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
					Send Reset Password Email
				</div>

			</div>


			<ErrorDisplay error={error}/>

			<div className="mb-6">
				<input
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
				<div className="pb-4 font-medium">
					Register
				</div>

			</div>


			<ErrorDisplay error={error}/>

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

			<div className="text-center lg:text-left">
				<button
					type="submit"
					className={"authPrimaryButton"}
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Register"}
				</button>
			</div>
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
				<Link to="/login">
					<p className="text-sm font-semibold mt-2 pt-1 mb-0">
						Already have an account?
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

export function RegisterPage() {
	return (
		<AuthCard>
			<RegisterForm/>
		</AuthCard>
	)
}

export function ForgotPasswordPage() {
	return (
		<AuthCard>
			<ForgotPasswordForm/>
		</AuthCard>
	)
}

export function ResetPasswordPage() {
	return (
		<AuthCard>

		</AuthCard>
	)
}

export function ActivateAccountPage() {
	let {error, isLoading, successMessage} = useActivateAccountViewModel()

	return (
		<AuthCard>
			<ErrorDisplay error={error}/>
			{isLoading ? <div>Loading...</div> : null}
			<MessageDisplay message={successMessage}/>
		</AuthCard>
	)
}

export function ResendEmailVerificationPage() {
	return (
		<AuthCard>

		</AuthCard>
	)
}


function AuthCard({children}: { children: React.ReactNode }) {
	return (
		<div className="flex justify-center items-center h-[100%]">

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
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}


function ErrorDisplay({error}: { error: string }) {
	if (!error) return null

	return (
		<div className="text-red-400">
			{error}
		</div>
	)
}

function MessageDisplay({message}: { message: string }) {
	if (!message) return null

	return (
		<div className="text-green-400">
			{message}
		</div>
	)
}
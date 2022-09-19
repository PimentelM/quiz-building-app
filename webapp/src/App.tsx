import {Outlet, ReactLocation, Router} from "@tanstack/react-location";
// import { ReactLocationSimpleCache } from "@tanstack/react-location-simple-cache";
import {ReactLocationDevtools} from "@tanstack/react-location-devtools";
import MainLayout from "./presentation/layouts/MainLayout";
import {Home} from "./presentation/pages/quiz/list/Home";
import {
	LoginPage

} from "./presentation/pages/auth/login/view";
import {QuizPage} from "./presentation/pages/quiz/player/Quiz";
import {QuizBuilder} from "./presentation/pages/quiz/builder/QuizBuilder";
import {ProvideAuth} from "./hooks/useAuth";
import {ProvideApi} from "./hooks/useApi";
import {RegisterPage} from "./presentation/pages/auth/register/view";
import {ActivateAccountPage} from "./presentation/pages/auth/activate-account/view";
import {ResetPasswordPage} from "./presentation/pages/auth/reset-password/view";
import {ForgotPasswordPage} from "./presentation/pages/auth/forgot-password/view";
import {ResendEmailVerificationPage} from "./presentation/pages/auth/resend-activation-email/view";


// Set up a ReactLocation instance
const location = new ReactLocation();

function App() {

	return (
		<Router
			location={location}
			routes={[
				{path: "/", element: <Home/>},
				{path: "/login", element: <LoginPage/>},
				{path: "/register", element: <RegisterPage/>},
				{path: "/quiz/:quizId", element: <QuizPage/>},
				{path: "/quiz-builder", element: <QuizBuilder/>},
				{path: "/activate-account", element: <ActivateAccountPage/>},
				{path: "/reset-password", element: <ResetPasswordPage/>},
				{path: "/forgot-password", element: <ForgotPasswordPage/>},
				{path: "/resend-verification", element: <ResendEmailVerificationPage/>},
				{path: "*", element: <div>Not Found</div>},
			]}
		>
			<ProvideAuth>
				<ProvideApi>
					<MainLayout>
						<Outlet/> {/* Start rendering router matches */}
						<ReactLocationDevtools/> {/* enable Devtools */}
					</MainLayout>
				</ProvideApi>
			</ProvideAuth>
		</Router>
	)
}

export default App

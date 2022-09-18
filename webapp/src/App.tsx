import {Outlet, ReactLocation, Router} from "@tanstack/react-location";
// import { ReactLocationSimpleCache } from "@tanstack/react-location-simple-cache";
import {ReactLocationDevtools} from "@tanstack/react-location-devtools";
import MainLayout from "./presentation/layouts/MainLayout";
import {Home} from "./presentation/pages/Home";
import {LoginPage, RegisterPage} from "./presentation/pages/auth/login/view";
import {Quiz} from "./presentation/pages/Quiz";
import {QuizBuilder} from "./presentation/pages/QuizBuilder";
import {ProvideAuth} from "./hooks/useAuth";
import {ProvideApi} from "./hooks/useApi";


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
				{path: "/quiz/:quizId", element: <Quiz/>},
				{path: "/quiz-builder", element: <QuizBuilder/>}
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

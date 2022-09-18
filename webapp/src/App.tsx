import {Outlet, ReactLocation, Router} from "@tanstack/react-location";
// import { ReactLocationSimpleCache } from "@tanstack/react-location-simple-cache";
import {ReactLocationDevtools} from "@tanstack/react-location-devtools";
import MainLayout from "./presentation/layouts/MainLayout";
import {Home} from "./presentation/pages/Home";
import {LoginPage, RegisterPage} from "./presentation/pages/AuthPages";
import {Quiz} from "./presentation/pages/Quiz";

// Set up a ReactLocation SimpleCache instance
// const routeCache = new ReactLocationSimpleCache();
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
				{path: "/quiz/:quizId", element: <Quiz/>}
			]}
		>
			<MainLayout>
				<Outlet/> {/* Start rendering router matches */}
				<ReactLocationDevtools/> {/* enable Devtools */}
			</MainLayout>
		</Router>
	)
}

export default App

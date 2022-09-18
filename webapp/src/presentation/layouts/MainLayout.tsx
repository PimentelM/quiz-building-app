import {Link, useMatch, useNavigate} from "@tanstack/react-location";
import {useAuth} from "../../hooks/useAuth";


function Navbar(){

	let navigate = useNavigate()
	let {clearToken} = useAuth()

	function logoff(){
		clearToken()
		navigate({to: "/"})
	}

	return (
		<div className="h-10 w-[100%] bg-gray-200 flex justify-between">
			<div className="flex items-center">
				<Link to="/"
				>
					<div className="ml-4 text-2xl font-bold">Quiz App</div>
				</Link>
			</div>

			<div>
				<div className="flex items-center pt-1">
					<Link to="/login">
						<div className="mr-4 text-xl font-bold">Login</div>
					</Link>
					<Link to="/register">
						<div className="mr-4 text-xl font-bold">Register</div>
					</Link>
					<Link to="/quiz/87TT9y">
						<div className="mr-4 text-xl font-bold">Quiz</div>
					</Link>
					<Link to="/quiz-builder">
						<div className="mr-4 text-xl font-bold">Quiz Builder</div>
					</Link>
					<div className="mr-4 text-xl font-bold" onClick={logoff}>
						Logout
					</div>

				</div>
			</div>
		</div>

	)
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
	  return (
		  <div>
			  <Navbar />
			  <div className="h-[100%]">
				  {children}
			  </div>
		  </div>
  );
}
import {Link, useMatch, useNavigate} from "@tanstack/react-location";


function Navbar(){

	let navigate = useNavigate()

	return (
		<div className="h-10 w-[100%] bg-gray-200 flex justify-between">
			<div className="flex items-center">
				<Link to="/"
				>
					<div className="ml-4 text-2xl font-bold">Quiz App</div>
				</Link>
			</div>

			<div>
				<div className="flex items-center">
					<Link to="/login">
						<div className="mr-4 text-xl font-bold">Login</div>
					</Link>
					<Link to="/register">
						<div className="mr-4 text-xl font-bold">Register</div>
					</Link>
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
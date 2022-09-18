import {Link, useMatch, useNavigate} from "@tanstack/react-location";
import {useAuth} from "../../hooks/useAuth";


function NavbarItem({to, children, reqAuth, hideIfAuth, action}: any) {
	let { isAuthenticated } = useAuth()

	if(reqAuth && !isAuthenticated){
		return null
	}

	if(hideIfAuth && isAuthenticated){
		return null
	}

	return (
		<Link onClick={action} to={to} className="mr-4 text-xl font-bold">
			{children}
		</Link>
	);
}

function Navbar(){

	let navigate = useNavigate()
	let {clearToken} = useAuth()

	function logoff(){
		clearToken()
		navigate({to: "/"})
	}

	let items = [
		{to: "/quiz/87TT9y", text: "Quiz"},
		{to: "/login", text: "Login", hideIfAuth: true},
		{to: "/register", text: "Register", hideIfAuth: true},
		{to: "/quiz-builder", text: "New Quiz", reqAuth: true},
		{to: "/", text: "Logoff", action: logoff, reqAuth: true}
	]

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
					{items.map((item, index) => {
						return (
							<NavbarItem key={index}
										to={item.to}
										reqAuth={item.reqAuth}
										hideIfAuth={item.hideIfAuth}
										action={item.action}>
								{item.text}
							</NavbarItem>
						);
					})}
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
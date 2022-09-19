export function AuthCard({children}: { children: React.ReactNode }) {
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


export function ErrorDisplay({error}: { error: string }) {
	if (!error) return null

	return (
		<div className="text-red-400">
			{error}
		</div>
	)
}

export function MessageDisplay({message}: { message: string }) {
	if (!message) return null

	return (
		<div className="text-green-400">
			{message}
		</div>
	)
}
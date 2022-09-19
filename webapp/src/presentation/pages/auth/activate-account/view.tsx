import {AuthCard, ErrorDisplay, MessageDisplay} from "../components";
import {useActivateAccountViewModel} from "./viewModel";

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


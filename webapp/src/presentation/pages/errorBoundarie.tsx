import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error,
	errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: undefined,
		errorInfo: undefined
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
		this.setState({ error, errorInfo });
	}

	public render() {
		if (this.state.hasError) {
			return <div>
				<h1>Sorry.. there was an error</h1>

				<p>Please contact admnistrators if error persists.</p>
			</div>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
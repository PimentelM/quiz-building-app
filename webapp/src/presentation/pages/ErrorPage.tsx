import {useMatch} from "@tanstack/react-location";

export function ErrorPage(){
	let {error} = useMatch()
  return (
	<div>
	  <h1>{ "Error" }</h1>
	</div>
  );
}
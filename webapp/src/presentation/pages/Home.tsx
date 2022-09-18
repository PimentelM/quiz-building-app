import {usePrivatePage} from "../../hooks/usePrivatePage";

export function Home(){
	usePrivatePage();

	  return (
	<div>This is home page</div>
  )
}
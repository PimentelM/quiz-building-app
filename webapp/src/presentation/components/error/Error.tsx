import React from "react";
import { useMatch } from "@tanstack/react-location";

const Error = (): JSX.Element => {
  const { error } = useMatch();
  return (
    <div>
      <div>Couldn't load data!</div>
      <div></div>
    </div>
  );
};

export default Error;

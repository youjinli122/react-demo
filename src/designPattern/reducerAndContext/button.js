import React, { useContext } from "react";
import { Context } from "./context";

const Main = () => {
  const { dispatch } = useContext(Context);

  return (
    <>
      <button onClick={() => dispatch({ type: "add" })}>加1</button>
      <button onClick={() => dispatch({ type: "del" })}>减1</button>
    </>
  );
};

export default Main;

import React, { useContext, useEffect } from "react";
import { Context } from "./context";

const Main = ({ children }) => {
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "loading" });
    }, 5000);
  }, [dispatch]);

  return <>{state.show ? <div>loading</div> : children}</>;
};

export default Main;

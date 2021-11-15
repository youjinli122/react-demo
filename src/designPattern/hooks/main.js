import React from "react";
import useHook from "./useHook";

const Main = () => {
  const { count, setCounts } = useHook();
  console.log(count, "main");
  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCounts("add")}>加</button>
      <button onClick={() => setCounts("del")}>减</button>
    </>
  );
};

export default Main;

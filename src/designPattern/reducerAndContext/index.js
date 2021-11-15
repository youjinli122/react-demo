import React, { useReducer } from "react";
import List from "./list";
import Button from "./button";
import Loading from "./loading";
import { reducer } from "./reducer";
import { Context } from "./context";
const initValue = {
  show: true,
  arr: [1, 2, 3, 4],
  color: "green",
};
const Main = () => {
  const [state, dispatch] = useReducer(reducer, initValue);
  console.log(state, "main");
  return (
    <Context.Provider value={{ state, dispatch }}>
      <h2>我是爸爸</h2>
      <Loading>
        <div>
          <List arr={state.arr} />
          <Button />
        </div>
      </Loading>
    </Context.Provider>
  );
};
export default Main;

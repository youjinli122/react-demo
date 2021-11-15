import React from "react";
import ReactReduxContext from "./reactReduxContext";

/**
 * 接受属性中的store，然后通过context传递给下级组件
 */
export default function Provider(props) {
  return (
    <ReactReduxContext.Provider
      value={{ store: props.store }}
    ></ReactReduxContext.Provider>
  );
}

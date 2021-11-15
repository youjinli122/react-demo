import React, { useContext } from "react";
import { ReactReduxContext } from "./reactReduxContext";
import { bindActionCreators } from "redux";
export default function useBoundDispatch(actionCreators) {
  const { store } = useContext(ReactReduxContext);
  return bindActionCreators(actionCreators, store.dispatch);
}

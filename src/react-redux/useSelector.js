import React, { useContext } from "react";
import { ReactReduxContext } from "./reactReduxContext";
export default function useSelector(selector) {
  const { store } = useContext(ReactReduxContext);
  let state = store.getState();
  let selectedState = selector(state);
  return selectedState;
}

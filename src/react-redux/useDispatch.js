import React, { useContext } from "react";
import { ReactReduxContext } from "./reactReduxContext";
export default function useDispatch() {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
}

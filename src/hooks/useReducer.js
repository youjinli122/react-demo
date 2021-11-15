import React from "react";
import Counter from "./useState";

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { number: state.number + 1 };
    default: {
      return { number: state.number };
    }
  }
}
const Couter = () => {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
};

export default Counter;

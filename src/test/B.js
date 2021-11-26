import React, { useState } from "react";
import D from "./D";

const B = (props) => {
  console.log("bbbbb-render");
  const [number, setNumber] = useState(0);
  return (
    <>
      <button onClick={() => setNumber(number + 1)}>{number}</button>
      <div>我是b</div>
      {props.children}
      <D />
    </>
  );
};
export default B;

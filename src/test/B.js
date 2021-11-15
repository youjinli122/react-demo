import React, { useState } from "react";
import C from "./C";

const B = () => {
  console.log("bbbbb");
  const [number, setNumber] = useState(0);
  return (
    <>
      <button onClick={() => setNumber(number + 1)}>{number}</button>
      <C />
    </>
  );
};
export default B;

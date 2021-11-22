import React from "react";
import B from "./B";

const A = (props) => {
  console.log("AAAA");
  const [number, setNumber] = React.useState(0);
  const btn = () => {
    // setNumber(number + 1);
    // setNumber(number + 2);
    // setNumber(number + 3);
    // 3
    setNumber((num) => num + 1);
    setNumber((num) => num + 2);
    setNumber((num) => num + 3);
    // 6
  };
  return (
    <>
      <button onClick={btn}>{number}</button>
      <B />
    </>
  );
};
export default A;

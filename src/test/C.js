import React, { useState } from "react";

const C = (props) => {
  console.log("cc--render", props);
  const [number, setCount] = useState(10);
  return <div onClick={() => setCount(number + 1)}>我是c{number}</div>;
};
export default C;

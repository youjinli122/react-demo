import React, { useState } from "react";

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("red");

  const setCounts = (type) => {
    if (type === "add") {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
  };
  return { count, setLoading, loading, setCounts, setColor, color };
};
export default Main;

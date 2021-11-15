import React from "react";
import useHook from "./useHook";

const Main = () => {
  const { color, setColor } = useHook();
  console.log(color, "color");
  return (
    <>
      <button
        onClick={() => setColor(color === "green" ? "red" : "green")}
        style={{ background: color }}
      >
        点我改变爸爸颜色
      </button>
    </>
  );
};

export default Main;

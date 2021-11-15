import React from "react";
import Header from "./header";
import Content from "./main";
import useHook from "./useHook";

const Main = () => {
  const { color, count } = useHook();
  console.log(count, "index", color);
  return (
    <>
      <p style={{ color }}>
        我是爸爸 {count} {color}
      </p>
      <Header />
      <Content />
    </>
  );
};

export default Main;

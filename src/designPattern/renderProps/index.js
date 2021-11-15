import React, { useRef } from "react";
import Container from "./container";
/**
 * render props是指一种react组件之间使用一个值为函数的prop共享代码技术
 * 具有render props的组件接受一个函数，该函数返回一个react元素，并调用他
 * 也是逻辑复用的一种方式
 */
const Main = () => {
  const setLoading = useRef(null);
  return (
    <>
      <Container>
        {({ setShowLoading }) => {
          setLoading.current = setShowLoading;
          return (
            <>
              <div className="index1">
                <button onClick={() => setShowLoading(true)}>loading</button>
              </div>
            </>
          );
        }}
      </Container>
      <button onClick={() => setLoading.current && setLoading.current(false)}>
        取消loading
      </button>
    </>
  );
};

export default Main;

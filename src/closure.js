import React, { useState, useEffect } from "react";

/**
 * 陈旧闭包
 */
const Main = () => {
  const [count, setCount] = useState(0);

  //   useEffect(() => {
  //     setInterval(() => {
  //       console.log(count, "count");
  //     }, 3000);
  //   }, []);
  //   const [list, setList] = useState([]);

  //   const add = () => {
  //     setList(
  //       list.concat(
  //         <button key={i} onClick={add}>
  //           {++i}
  //         </button>
  //       )
  //     );
  //   };

  return (
    <div>
      <button
        onClick={() => {
          setTimeout(() => {
            setCount(count + 1);
          }, 1000);
        }}
      >
        {count}
      </button>
      {/* {list.map((val) => val)} */}
    </div>
  );
};

export default Main;

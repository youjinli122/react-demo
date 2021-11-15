import React, { useState, useEffect } from "react";

const Counter = () => {
  const [number, setNumber] = useState(1);

  useEffect(() => {
    // const tiemr = setInterval(() => {
    //   //setNumber(number+1); 因为闭包的问题，number一直都是初始化的number
    //   setNumber((number) => number + 1); // 拿到上一次的返回值
    // }, 1000);
    // return () => {
    //   clearInterval(tiemr); // 在执行下一个useEffect回调执行会先销毁再执行
    // };
  }, []); // 此出不加依赖数组会到处每1秒都在创建一个计时器 ，因为deps依赖没有发生变化，所以number 始终取到的是初始值

  useEffect(() => {
    const tiemr = setInterval(() => {
      setNumber(number + 1); //因为闭包的问题，number一直都是初始化的number
      // setNumber((number) => number + 1); // 拿到上一次的返回值
    }, 1000);
    return () => {
      console.log("清除");
      clearInterval(tiemr); // 在执行下一个useEffect回调执行会先销毁再执行
    };
  }, []);
  return <p>{number}</p>;
};

export default Counter;

/**
 *
 * useEffect的回调方法是在组件渲染完毕才会执行，useEffect的回调方法是依次执行的，并且在销毁了上一个只会才会去执行下一个
 * 每次渲染都会重新开启一个定时器
 * 1.依赖一个空数组，只会执行一次
 * 2.在下一次执行useEffect回调前执行销毁方法
 */

/**
 * useLayoutEffect会在所有dom变更之后同步调用effect
 * useEffect不会阻塞浏览器渲染，而useLayoutEffect会阻塞渲染
 * useEffect会在浏览器渲染结束后执行，useLayoutEffect则是在dom更新完成后，浏览器绘制之前执行
 */

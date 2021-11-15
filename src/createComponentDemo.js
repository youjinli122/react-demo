import React from "./react";
import ReactDom from "./react-dom";

/**
 * 函数组件其实就是一个接受属性对象然后返回一个要渲染的React元素
 */
export function FunctionComponent(props) {
  let eme2 = React.createElement(
    "h1",
    {
      className: "title",
      style: {
        color: "red",
      },
    },
    "hello ",
    React.createElement("span", null, "world")
  );
  return eme2;
}

/**
 * 通过类定义组件
 * 累组件渲染手通过 属性对象创建类组件的实例，调用实例的render方法返回vdom
 */
export class ClassComponent extends React.Component {
  constructor(props) {
    super(); // super等于parent.call(this，props)；
  }
  render() {
    return <h1>{this.props.title}</h1>;
  }
}

/**
 * React.createElement返回一个react元素也就是虚拟dom eme1创建成mem2这样 ReactDom.render负责渲染,把虚拟dom转换成真实dom
 * 在编译阶段 bable把jsx转成 React.createElement
 * 在浏览器端执行React.createElement方法，返回一个js对象=虚拟dom，ReactDom.render再把虚拟dom渲染成真实dom
 * bable -> jsx-=React.createElement-=vdom-=dom
 */

export let eme3 = React.createElement(ClassComponent, { title: "标题" });

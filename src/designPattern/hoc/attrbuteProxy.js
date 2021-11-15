import React from "react";

/**
 * 高阶组件实现属性代理
 * 属性代理，此state给到oldComponent组件使用
 */
const WithLoading = (message) => (OldComponent) => {
  return class extends React.Component {
    render() {
      const state = {
        show: () => {
          let div = document.createElement("div");
          div.innerHTML = `<p id='loading'>${message}</p>`;
          document.body.appendChild(div);
        },
        hide: () => {
          document.getElementById("loading").remove();
        },
      };
      return <OldComponent {...{ ...this.props, ...state }} />;
    }
  };
};

class Hello extends React.Component {
  render() {
    return (
      <div>
        {this.props.title}
        <button onClick={this.props.show}>展示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    );
  }
}
let AttrbuteProxy = WithLoading("加载中")(Hello);
export default AttrbuteProxy;

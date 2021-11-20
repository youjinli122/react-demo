import React from "react";
import ReactDOM from "react-dom";

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.node = document.createElement("div");
    document.body.appendChild(this.node);
  }
  componentWillUnmount() {
    document.body.removeChild(this.node);
  }
  render() {
    // 把一个jsx插入到指定的dom节点
    ReactDOM.createPortal(<div>{this.props.children}</div>, this.node);
    return <div></div>;
  }
}

export default Dialog;

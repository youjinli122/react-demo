import React from "./react";

// 函数式组件不能添加ref因为函数式没有实例，用完既销毁，不想创建实例为了减少内存
class Calculate extends React.Component {
  constructor(props) {
    super(props);
    this.aRef = React.createRef();
    this.bRef = React.createRef();
    this.resultRef = React.createRef();
  }
  handleAdd = () => {
    let a = this.aRef.current.value;
    let b = this.bRef.current.value;
    this.resultRef.current.value = a + b;
  };
  render() {
    return (
      <div>
        <input ref={this.aRef} /> +<input ref={this.bRef} />
        <button onClick={this.handleAdd}>=</button>
        <input ref={this.resultRef} />
      </div>
    );
  }
}

export default Calculate;

import React from "./react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    //   this.props.title = '新标题'; // props只读不能更改
    //   this.state.number = 1; // 可以更改但是页面不会刷新
    this.setState({ number: (this.state.number += 1), age: 10 });
    this.setState(() => {
      return { number: (this.state.number += 1), age: 20 };
    });
    console.log(this.state, "stttt");
  };

  handleDivClick = () => {
    console.log("handleDivClick");
  };

  render() {
    return (
      <div onClick={this.handleDivClick}>
        <p>标题：{this.props.title}</p>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}
export default Counter;

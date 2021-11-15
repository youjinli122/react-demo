import React from "./react";

class ChildLifeCycle extends React.Component {
  componentWillUmount() {
    console.log("ChildLifeCycle 将要卸载");
  }
  componentWillMount() {
    console.log("1.ChildLifeCycle 将要挂载");
  }
  componentDidMount() {
    console.log("3.ChildLifeCycle componentDidMount");
  }
  // 组件将要接受到新属性
  componentWillReceiveProps(nextProps) {
    console.log("4.ChildLifeCycle 组件将要接受到新属性");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("5.ChildLifeCycle shouldComponentUpdate");
    return nextProps.count % 3 === 0;
  }

  render() {
    console.log("2.ChildLifeCycle render");
    return (
      <div>
        <div>{this.props.count}</div>
      </div>
    );
  }
}

class LifeCycle extends React.Component {
  // 1. 设置默认属性和初识状态
  static defaultProps = {
    name: "React生命周期",
  };

  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log("-----》1.进来了LifeCycle");
  }
  componentWillMount() {
    console.log("-----》2.componentWillMount");
  }
  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 });
  };
  shouldComponentUpdate(nextProps, nextState) {
    console.log("-----》5.shouldComponentUpdate更新");
    return nextState.number % 2 === 0;
  }
  componentWillUpdate() {
    console.log("-----》6.componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("-----》7.componentDidUpdate");
  }
  componentDidMount() {
    console.log("-----》4.componentDidMount");
  }

  render() {
    console.log("-----》3. render");
    return (
      <div>
        <div>{this.state.number}</div>
        {this.state.number === 4 ? null : (
          <ChildLifeCycle count={this.state.number} />
        )}
        <button onClick={this.handleClick}></button>
      </div>
    );
  }
}

export default LifeCycle;

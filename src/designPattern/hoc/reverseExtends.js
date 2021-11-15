import React from "react";
/**
 * 反向继承： 拦截生命周期、state,渲染过程
 * 场景：比如一个第三方提供的组件，我们不能修改，不能继承，但是可以做一些增强
 * 正常继承，先执行父类再执行子类，但是反向继承相反
 * 生命周期，state,props都会被覆盖
 */

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "张三" };
  }
  render() {
    console.log(this.props, "button");
    return (
      <>
        <button>{this.props.title}</button>
        <p>{this.state.name}</p>
      </>
    );
  }
}

const Wrapper = (OldComponent) => {
  return class extends OldComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state, number: 0 };
    }

    handleClick = () => {
      this.setState({ number: this.state.number + 1 });
    };
    render() {
      console.log("wrapper", this.props, this.state);
      let renderVdom = super.render();
      let newProps = {
        ...renderVdom.props,
        ...this.state,
        onClick: this.handleClick,
      };
      return React.cloneElement(
        renderVdom,
        newProps,
        this.state.number,
        this.props.title
      );
    }
  };
};
let WrapperButton = Wrapper(Button);
export default WrapperButton;

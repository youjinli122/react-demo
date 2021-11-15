import React from "../../react";
import Header from "./header";
import Main from "./main";
import Footer from "./footer";
// import { Provider } from "./config";
import { ThemeContext } from "./config";
// const Context = React.createContext(null);
/**
 * 一般只有全局的数据才用context，contextType在组件里是全局变量
 * 如果是类组件: 可以添加contextType属性来取到this.context
 * 如果是函数式组件: 使用Consumer消费者模式
 * Provider提供者模式,Consumer消费者模式
 * createContext创建一个context对象返回context.Provider & context.Consumer,Provider和Consumer公用一个context对象
 */

class Provide extends React.Component {
  constructor() {
    super();
    this.state = { color: "red" };
  }
  onChange = (color) => {
    this.setState({ color });
  };
  render() {
    // 属性必须是value，只能传一个对象，如果传多个，默认取最后一个
    const value = {
      color: this.state.color,
      onChange: this.onChange,
    };
    return (
      <ThemeContext.Provider value={value}>
        <div>
          <Header />
          <Main />
          <Footer />
        </div>
      </ThemeContext.Provider>
    );
  }
}

export default Provide;

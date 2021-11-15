import React from "../../react";
import { ThemeContext } from "./config";

class Main extends React.Component {
  //1.写法1 函数式写法，消费者模式
  //   render() {
  //     return (
  //       <Consumer>
  //         {(val) => (
  //           <>
  //             <button onClick={() => val.onChange("red")}>红色</button>
  //             <button onClick={() => val.onChange("green")}>绿色</button>
  //           </>
  //         )}
  //       </Consumer>
  //     );
  //   }
  //2.写法2
  static contextType = ThemeContext;
  render() {
    return (
      <div>
        <button onClick={() => this.context.onChange("red")}>红色</button>
        <button onClick={() => this.context.onChange("green")}>绿色</button>
      </div>
    );
  }
}

export default Main;

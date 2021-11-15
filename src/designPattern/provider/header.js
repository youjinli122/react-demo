import React from "../../react";
// import { Consumer } from "./config";
import { ThemeContext } from "./config";

class Main extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          width: "200px",
          height: "100px",
          border: "1px solid " + this.context.color,
        }}
      >
        header
      </div>
    );
  }
}

export default Main;

import React from "../../react";
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
        footer
      </div>
    );
  }
}

export default Main;

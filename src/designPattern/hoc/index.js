import React from "react";
import AttrbuteProxy from "./attrbuteProxy";
import ReverseExtends from "./reverseExtends";

class Main extends React.Component {
  render() {
    return (
      <div>
        <AttrbuteProxy title="属性代理" />
        <ReverseExtends title="反向继承" />
      </div>
    );
  }
}

export default Main;

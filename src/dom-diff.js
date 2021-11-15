// let lastPlaceIndex = 0; // 上一个需要移动的老节点
// // 声明一个map，把老的儿子的key和它对应得虚拟dom节点关联起来放在map里
// let oldChildrenMap = {
//   A: "A对应的虚拟dom",
//   B: "B对应的虚拟dom",
//   C: "C对应的虚拟dom",
//   D: "D对应的虚拟dom",
//   E: "E对应的虚拟dom",
//   G: "G对应的虚拟dom",
//   F: "F对应的虚拟dom",
// };
// let newChildren = [];
// for (let i = 0; i < newChildren.length; i++) {
//   let newChild = newChildren[i];
//   let newKey = newChild.key;
//   let oldChild = oldChildrenMap[newKey];
//   if (oldChild) {
//     // 如果可以复用的老节点它原来的索引要比lastPlaceIndex小，就需要移动
//     if (oldChild._mountIndex < lastPlaceIndex) {
//       // 可以复用老节点，但是老节点需要移动到当前位置
//     }
//     lastPlaceIndex = Math.max(lastPlaceIndex, oldChild._mountIndex);
//   }
// }
import React from "react";

class DomDiff extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: ["A", "B", "C", "D", "E", "F"] };
  }
  handler = () => {
    this.setState({ list: ["A", "C", "E", "B", "G"] });
  };
  render() {
    return (
      <React.Fragment>
        <ul>
          {this.state.list.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <button onClick={this.handler}>+</button>
        <></>
      </React.Fragment>
    );
  }
}
export default DomDiff;

import React from "react";
import ReactReduxContext from "./reactReduxContext";
import { bindActionCreators } from "../redux";

/**
 * 高阶组件，传递老组件，返回链接仓库后的新组件
 * mapStateToProps 把仓库中的状态经过映射后变成老组件的属性
 * mapDispatchProps 把store.dispatch 方法和actionCreator绑定后变成老组件的属性
 */
function connect(mapStateToProps, mapDispatchProps) {
  return function (OldComponent) {
    return class extends React.Component {
      static contextType = ReactReduxContext;
      constructor(props, context) {
        super(props);
        let { store } = context;
        let { getState, dispatch, subscribe } = store;
        // 处置初始状态
        this.state = mapStateToProps(getState());
        // 订阅状态变化事件，当状态发生变化时执行订阅事件，重新映射新状态，修改state
        this.unsubscribe = subscribe(() => {
          this.setState(mapStateToProps(getState()));
        });
        this.dispatchProps = bindActionCreators(mapDispatchProps, dispatch);
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return (
          <OldComponent
            {...this.state}
            {...this.dispatchProps}
            {...this.props}
          />
        );
      }
    };
  };
}
export default connect;

import { findDom, compareTwoVdom } from "./react-dom";

/**
 * classInstance 实例
 * nextProps 属性
 * nextState 状态
 */
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 表示组件是否要更新
  // 如果有此方法并且返回了false
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false; // 表示不需要更新
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState; // 不管要不要更新，状态和属性　必须要更新
  if (willUpdate) {
    classInstance.forceUpdate(); // 强制更新
  }
}

export let updateQueue = {
  isBatchingUpdate: false, // 默认值是非批量，同步的
  updaters: [], // 更新队列
  batchUpdate() {
    for (let updaters of updateQueue.updaters) {
      updaters.updateComponent();
    }
    updateQueue.updaters.length = 0;
    updateQueue.isBatchingUpdate = false;
  },
};

// 每个组件都有一个更新器
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate(); // 触发更新
  }
  // 发射更新，如果状态或者属性发生变化也会调用
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 有可能是批量异步更新，也有可能是同步更新
    if (updateQueue.isBatchingUpdate) {
      // 批量异步更新
      updateQueue.updaters.push(this); // 不刷新视图，只是把这个updater实例添加到updateQueue做批量处理
    } else {
      // 同步直接更新
      this.updateComponent();
    }
  }
  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    // 如果属性变了或者状态变了都会触发更新
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance; // 拿到老状态
    pendingStates.forEach((partialState) => {
      partialState =
        typeof partialState === "function" ? partialState(state) : partialState;
      state = { ...state, ...partialState };
    });
    pendingStates.length = 0;
    return state;
  }
}

class Component {
  // 源码的写法是Component.prototype.isReactComponent = {}
  static isReactComponent = true; // 当子类继承父类的时候，父类的静态属性也是可以继承的
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    // partialState部分状态
    this.updater.addState(partialState);
  }
  // 根据新的属性状态计算新的要渲染的虚拟dom
  forceUpdate() {
    console.log("更新dom");
    let oldRenderVdom = this.oldRenderVdom; // 上一次类组件render方法计算得到的虚拟dom
    let oldDom = findDom(oldRenderVdom); // 获取虚拟dom对应的真实dom；
    if (this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue; // 每次更新都需要重新设置一下
    }
    let newRenderVdom = this.render(); // 基于新属性新状态计算新的vdom；
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom; // 重置替换
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}
// Component.prototype.isReactComponent = {};

export default Component;

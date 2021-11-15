/**
 * 把虚拟dom转换成真实dom并插入容器
 * vdom 虚拟dom
 * container 容器
 */

import {
  REACT_TEXT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  MOVE,
  PLACEMENT,
  REACT_PROVIDER,
  REACT_CONTEXT,
  REACT_MEMO,
} from "./constant";
import { addEvent } from "./event";

let scheduleUpdate;
let hookIndex = 0; // 当前hook的索引值
let hookState = []; // 用来记录hook的值

function render(vdom, container) {
  mount(vdom, container);
  // 在React不管哪里触发的更新，真正的调度都是从根节点自顶向下开始的；
  scheduleUpdate = () => {
    hookIndex = 0;
    compareTwoVdom(container, vdom, vdom);
  };
}

function mount(vdom, parentDom) {
  let newDom = createDom(vdom);
  if (newDom) {
    parentDom.appendChild(newDom);
    if (newDom._componentDidMount) newDom._componentDidMount(); //挂载完成
  }
}
/**
 * 把虚拟dom转化成真实dom
 */
export function createDom(vdom) {
  if (!vdom) return null;
  let { type, props, ref } = vdom;
  let dom; //真实dom
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemo(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProvider(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContext(vdom);
  } else if (type && type === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
  } else if (type === REACT_TEXT) {
    // 文本
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type); // div span。。。
  }
  // 处理属性
  if (props) {
    updateProps(dom, {}, props);
    if (props.children) {
      let children = props.children;
      if (typeof children === "object" && children.type) {
        // 说明这是一个React元素
        children._mountIndex = 0;
        mount(children, dom);
      } else if (Array.isArray(children)) {
        if (children.length === 3) {
          console.log(children, "children");
        }
        reconcileChildren(children, dom);
      }
    }
  }
  vdom.dom = dom; // 把真实dom给虚拟dom的dom属性
  if (ref) ref.current = dom; // 如果把虚拟dom转成真实dom就让ref的current等于真实的dom
  return dom;
}
/**
 * 渲染Provider组件
 * 1.真正渲染的是他的儿子children
 * 2.把Provider的组件自己收到的value属性赋值给context._currentValue
 */
function mountProvider(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  context._currentValue = props.value;
  let renderVdom = props.children; // 渲染组件的子组件
  vdom.oldRenderVdom = renderVdom; // 当前的虚拟dom指向要渲染的虚拟dom
  return createDom(renderVdom);
}
function mountContext(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  let contextValue = context._currentValue;
  let renderVdom = props.children(contextValue); // props.children是一个函数组件
  vdom.oldRenderVdom = renderVdom; // 当前的虚拟dom指向要渲染的虚拟dom
  return createDom(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);
  if (ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue;
  }
  if (ref) ref.current = classInstance; // 如果有值把实例给ref；
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  let renderVdom = classInstance.render(); // 子类的render，返回要渲染的vdom
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  vdom.classInstance = classInstance;
  // 把类组件render方法返回的虚拟dom转化成真实的dom
  let dom = createDom(renderVdom);
  if (classInstance.componentDidlMount) {
    dom._componentDidMount =
      classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props); // 给函数执行 返回vdom
  vdom.oldRenderVdom = renderVdom; // 对比更新使用
  return createDom(renderVdom);
}
function mountForwardComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type.render(props);
  vdom.oldRenderVdom = renderVdom; // 对比更新使用
  return createDom(renderVdom);
}

/**
 * 把新的属性更新到真实的dom上
 * dom 真实dom
 * oldProps 旧属性
 * newProps 新属性
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]); // dom,事件，方法
      // dom[key.toLocaleLowerCase()] = newProps[key]; // 绑定事件
    } else {
      dom[key] = newProps[key]; // classname
    }
  }
}

function reconcileChildren(childrenVdom, parentDom) {
  childrenVdom.forEach((childVdom, index) => {
    childVdom._mountIndex = index;
    mount(childVdom, parentDom);
  });
}

function mountMemo(vdom) {
  let { type, props } = vdom;
  let renderVdom = type.type(props); // 函数组件
  vdom.prevProps = props; // 上一次的状态，更新时比较使用
  vdom.oldRenderVdom = renderVdom; // findDom使用
  return createDom(vdom);
}
function updateMemo(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  // 进行比较，相等不更新，不想等就更新
  let renderVdom = oldVdom.oldRenderVdom;
  if (type.compare(prevProps, newVdom.props)) {
    let currentDom = findDom(oldVdom);
    let parentDom = currentDom.parentNode;
    let { type, props } = newVdom;
    renderVdom = type.type(props);
    compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom);
  }
  newVdom.prevProps = newVdom.props;
  newVdom.oldRenderVdom = renderVdom;
}

export function findDom(vdom) {
  if (vdom.dom) {
    // {type: 'h1'}
    return vdom.dom;
  } else {
    // 类组件、函数组件，他们虚拟dom身上都没有dom属性，但是oldRenderVdom有
    return findDom(vdom.oldRenderVdom);
  }
}
/**
 * dom diff
 * 1. 老新都没有
 * 2. 老有新没有 卸载老节点
 * 3. 老没有新有
 * 4. 老新都有
 * */
export function compareTwoVdom(parentNode, oldVdom, newVdom, nextDom) {
  if (!oldVdom && !newVdom) {
    return null;
  } else if (!!oldVdom && !newVdom) {
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    let dom = createDom(newVdom);
    if (nextDom) {
      parentNode.inserBefore(dom, nextDom);
    } else {
      parentNode.appendChild(dom);
    }
    if (dom._componentDidMount) dom._componentDidMount();
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom); // 删除老节点
    let newDom = createDom(newVdom);
    parentNode.appendChild(newDom);
    if (newVdom._componentDidMount) newVdom._componentDidMount();
    // 如果老的游新的也有并且类型一致只需要更新就可以，复用老的节点了
  } else {
    // 进入深度对比
    updateElement(oldVdom, newVdom);
  }
}
/**
 * 深度更新
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemo(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProvider(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContext(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT) {
    if (oldVdom.props.content !== newVdom.props.content) {
      let currentDom = (newVdom.dom = findDom(oldVdom));
      currentDom.textContent = newVdom.props.content; // 更新文本节点
    }
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDom = (newVdom.dom = findDom(oldVdom));
    updateChildren(currentDom, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "string") {
    let currentDom = (newVdom.dom = findDom(oldVdom)); // 取出老的真实dom准备复用
    updateProps(currentDom, oldVdom.props, newVdom.props); // 直接复用新老属性
    updateChildren(currentDom, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      // 类组件
      updateClassComponent(oldVdom, newVdom);
    } else {
      // 函数组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateProvider(oldVdom, newVdom) {
  let currentDom = findDom(oldVdom);
  let parentDom = currentDom.parentNode; // div#root
  let { type, props } = newVdom; // type={$$typeof: REACT_PROVIDER,_context: context};
  let context = type._context; // context附上新的_currentValue
  context._currentValue = props.value;
  let renderVdom = props.children;
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateContext(oldVdom, newVdom) {
  let currentDom = findDom(oldVdom);
  let parentDom = currentDom.parentNode; // div#root
  let { type, props } = newVdom; // type={$$typeof: REACT_PROVIDER,_context: context};
  let context = type._context; // context附上新的_currentValue
  let renderVdom = props.children(context._currentValue);
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}

function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance);
  let oldRenderVdom = (newVdom.oldRenderVdom = oldVdom.oldRenderVdom);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
  if (!oldVdom) return;
  let currentDom = findDom(oldVdom);
  let parentDom = currentDom.parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, newVdom.oldRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 实现完整的dom-diff算法
 */
function updateChildren(parentDom, oldVchildren, newVchildren) {
  oldVchildren = Array.isArray(oldVchildren)
    ? oldVchildren
    : oldVchildren
    ? [oldVchildren]
    : [];
  newVchildren = Array.isArray(newVchildren)
    ? newVchildren
    : newVchildren
    ? [newVchildren]
    : [];
  let keyOldMap = {};
  let lastPlacedIndex = 0;
  oldVchildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key || index;
    keyOldMap[oldKey] = oldVChild;
  });

  let patch = []; // 存放将要进行的操作

  newVchildren.forEach((newVChild, index) => {
    newVChild._mountIndex = index;
    let newKey = newVChild.key || index;
    let oldVChild = keyOldMap[newKey];
    if (oldVChild) {
      updateElement(oldVChild, newVChild); // 如果找到了就更新虚拟dom属性
      if (oldVChild._mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          fromIndex: oldVChild._mountIndex,
          toIndex: index,
        });
      }
      // 如果此节点被复用，把它从map中删掉
      let newKey = newVChild.key || index;
      delete keyOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild._mountIndex);
    } else {
      // 没有找到可复用的老节点
      patch.push({
        type: PLACEMENT,
        newVChild,
        toIndex: index,
      });
    }
  });

  // 获取要移动的元素
  // 此处并没有销毁，还在内存中,获取要移动的元素
  const moveChilds = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVChild);

  Object.values(keyOldMap)
    .concat(moveChilds)
    .forEach((oldVChild) => {
      let currentDom = findDom(oldVChild);
      // 删除真实的dom
      currentDom.parentNode && currentDom.parentNode.removeChild(currentDom);
    });

  patch.forEach((action) => {
    let { type, oldVChild, newVChild, fromIndex, toIndex } = action;

    let childNodes = parentDom.childNodes;

    if (type === PLACEMENT) {
      let newDom = createDom(newVChild); // 根据虚拟dom创建真实dom
      let childDomNode = childNodes[toIndex];

      if (childDomNode) {
        parentDom.inserBefore(newDom, childDomNode);
      } else {
        parentDom.appendChild(newDom);
      }
    } else if (type === MOVE) {
      let oldDom = findDom(oldVChild); // 根据虚拟dom创建真实dom
      let childDomNode = childNodes[toIndex];
      if (childDomNode) {
        // 如果此位置已经有dom元素
        parentDom.inserBefore(oldDom, childDomNode);
      } else {
        parentDom.appendChild(oldDom);
      }
    }
  });
}

function unMountVdom(vdom) {
  let { props, ref } = vdom;
  let currentDom = findDom(vdom); // vdom可能是span、div / 类组件 / 函数组件
  if (vdom.classInstance && vdom.classInstance.componentWillUmount) {
    vdom.classInstance.componentWillUmount();
  }
  if (ref) {
    ref.current = null;
  }

  Object.keys(props).forEach((propName) => {
    if (propName.slice(0, 2) === "on") {
      delete currentDom._store;
    }
  });
  if (props.children) {
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach(unMountVdom);
  }
  currentDom.parentNode.removeChild(currentDom);
}
/**
 * hooks
 */

export function useState(initialValue) {
  // return useReducer(null, initialValue) useState是useReducer的语法糖
  hookState[hookIndex] = hookState[hookIndex] || initialValue;
  let currentIndex = hookIndex;
  function setState(newState) {
    hookState[currentIndex] = newState; // currentIndex指向hookIndex赋值时的值
    scheduleUpdate(); // 状态变化后执行调度更新
  }
  return [hookState[hookIndex++], setState];
}

export function useReducer(reducer, initialValue) {
  hookState[hookIndex] = hookState[hookIndex] || initialValue;
  let currentIndex = hookIndex;
  function dispatch(action) {
    action =
      typeof action === "function" ? action(hookState[currentIndex]) : action;
    hookState[currentIndex] = reducer(hookState[currentIndex], action);
    scheduleUpdate();
  }
  return [hookState[hookIndex++], dispatch];
}
/**
 * factory 可以用来创建对象的工厂方法
 * deps 依赖数组
 */

export function useMemo(factory, deps) {
  // 先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastMemo, lastDeps] = hookState[hookIndex];
    let same = lastDeps.every((item, index) => item === lastDeps[index]); // 判断数组有没有发生变化
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    // 第一次
    let newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
/**
 * callback 可以用来创建对象的工厂方法
 * deps 依赖数组
 */

export function useCallback(callback, deps) {
  // 先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastCallback, lastDeps] = hookState[hookIndex];
    let same = lastDeps.every((item, index) => item === lastDeps[index]); // 判断数组有没有发生变化
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    // 第一次
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}
// 类似全局变量
export function useContext(context) {
  return context._currentValue;
}

export function useEffect(effect, deps) {
  // 先判断是不是初次渲染
  if (hookState[hookIndex]) {
    let [lastDestory, lastDeps] = hookState[hookIndex];
    let same = lastDeps.every((item, index) => item === lastDeps[index]); // 判断数组有没有发生变化
    if (same) {
      hookIndex++;
    } else {
      lastDestory && lastDestory(); // 清除上一次的销毁函数之后再去执行新的effect
      setTimeout(() => {
        let destory = effect();
        hookState[hookIndex] = [destory, deps];
      });
    }
  } else {
    // 第一次
    setTimeout(() => {
      let destory = effect();
      hookState[hookIndex] = [destory, deps];
    });
  }
}

const ReactDOM = {
  render,
};
export default ReactDOM;

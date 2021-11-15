import { updateQueue } from "./Component";
/**
 * 实现事件委托
 */
export function addEvent(dom, eventType, eventHandler) {
  let store;
  if (dom._store) {
    // _store是给原生dom对象上添加自定义属性
    store = dom._store;
  } else {
    dom._store = {};
    store = dom._store;
  }
  store[eventType] = eventHandler;
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}
/**
 * 不管点什么按钮，触发什么事件，都执行这个方法
 * 在合成事件的处理函数中，状态更新是批量的
 * event,不同的浏览器，event可能不一样
 */
function dispatchEvent(event) {
  // target 事件源 type click
  let { target, type } = event;
  let eventType = "on" + type;
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  let currentTarget = target;
  // 模拟向上冒泡的过程
  while (currentTarget) {
    // 获取事件源dom对象上的store属性
    let { _store } = currentTarget;
    let eventHandler = _store && _store[eventType]; // handleClick
    if (eventHandler) {
      syntheticEvent.target = target;
      syntheticEvent.currentTarget = currentTarget;
      eventHandler && eventHandler.call(target, syntheticEvent); // handleClick()
    }
    currentTarget = currentTarget.parentNode;
  }
  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  // 此处会有兼容性处理
  return syntheticEvent;
}

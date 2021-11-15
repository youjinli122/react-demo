function createHashHistory() {
  let historyStack = []; // 需要自己维护路由栈
  let current = -1; // 代表当前指针
  let action = "POP"; // 代表当前动作
  let state;
  let listeners = []; // 监听函数数组的组成
  function listen(listener) {
    listeners.push(listener);
    return () => (listeners = listeners.filter((l) => l !== listener));
  }
  function hashChangeHandler(event) {
    let pathname = window.location.hash.slice(1);
    let location = { pathname, state };
    Object.assign(history, { action, location });
    if (action === "PUSH") {
      historyStack[++current] = location;
    }
    listeners.forEach((listener) => listener(listener.location));
  }
  window.addEventListener("hashchange", hashChangeHandler);
  function push(pathname, nextState) {
    action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    window.location.hash = pathname; // 改变hash地址
  }
  let history = {
    action: "POP",
    go,
    goBack,
    goForward,
    push,
    listen,
    location: {},
  };
  if (window.location.hash) {
    action = "PUSH";
    hashChangeHandler();
  } else {
    window.location.hash = "/";
  }
  return history;
}
export default createHashHistory;

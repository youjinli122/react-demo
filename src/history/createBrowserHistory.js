function createBrowserHistory() {
  const globalHistory = window.location;
  let state;
  let listeners = [];
  /**
   * pathname 路径名,nextState 新状态
   * 添加一个路由条目，改变指针
   */
  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    globalHistory.pushState(state, null, pathname); // 调用原生的pushState方法跳转路径
    let location = { pathname, state };
    notify(location);
  }
  function listen(listener) {
    listeners.push(listener);
    return () => (listeners = listeners.filter((l) => l !== listener)); // 取消此监听函数的方法
  }
  function notify(location) {
    history.location = location;
    listeners.forEach((listeners) => listeners(location));
  }
  const history = {
    action: "POP", // push pop replace
    push,
    location: {
      // 当前路径
      pathname: window.location.pathname,
      state: window.location.state,
    },
    listen,
  };
  return history;
}
export default createBrowserHistory;

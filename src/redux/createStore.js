/**
 * reducer
 * 传递初始值有2种方式，一种是reducer initialState,一种是createStore preloadState，preloadState优先级高
 */
export default function createStore(reducer, preloadState) {
  let state = preloadState;
  let listeners = [];
  function getState() {
    return state;
  }
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  }
  function subscribe(listen) {
    listeners.push(listen);
    return () => {
      listeners = listeners.filter((l) => l !== listen);
    };
  }
  dispatch({ type: "###" }); // 首次调用，返回默认state
  return {
    getState,
    dispatch,
    subscribe,
  };
}

/**
 * 中间件
 * dispatch改造后的dispatch
 * 能传给原生的store.dispatch方法只能是纯对象，不能是函数
 * let obj1 = {type:1}
 * Object.getPrototypeOf(obj1) === Object.prototype // true
 * Object.getPrototypeOf(function(){}) === Object.prototype // false
 * Object.getPrototypeOf(new Promise()) === Object.prototype // false
 */
function thunk({ getState, dispatch }) {
  return function (originDispatch) {
    return function (action) {
      if (typeof action === "function") {
        return action(dispatch, getState); // 这里处理异步，比如setTimeout(()=>dispatch)再次派发然后走到了originDispatch
      }
      return originDispatch(action);
    };
  };
}
export default thunk;

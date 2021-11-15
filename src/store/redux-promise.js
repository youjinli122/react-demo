/**
 * 中间件 解决promise
 */
function promise({ getState, dispatch }) {
  return function (originDispatch) {
    return function (action) {
      if (action.then && typeof action === "function") {
        return action.then(dispatch);
      }
      return originDispatch(action);
    };
  };
}
export default thunk;

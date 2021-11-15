/**
 * 如果大型项目需要多个reducer，由于redux的单一仓库，单一reducer的思想，所以需要合并reducer，分而治之
 * combinedReducer可以把多个reducer函数组件合并成一个reducer
 * 合成之后会返回一个reducer
 * reducers = {
 *  reducer1,
 *  reducer2
 * }
 */
export default function combinedReducer(reducers) {
  /**
   * state存放总状态
   */
  return function combination(state = {}, action) {
    let nextState = {};
    for (let key in reducers) {
      // 根据每个子reducer的老状态和动作，计算每个reducer的新的状态
      nextState[key] = reducers[key](state[key], action);
    }
    return nextState; //返回新状态
  };
}

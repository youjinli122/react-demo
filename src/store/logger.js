function logger({ getState, dispatch }) {
  return function (originDispatch) {
    return function (action) {
      console.log("prev state", getState());
      originDispatch(action);
      console.log("next state", getState());
      return action;
    };
  };
}
export default logger;

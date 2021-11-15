export default function bindActionCreators(actionCreators, dispatch) {
  let boundActionCreators = {};
  for (let key in actionCreators) {
    const actionCreator = actionCreators[key];
    boundActionCreators[key] = function () {
      dispatch(actionCreator());
    };
  }
}

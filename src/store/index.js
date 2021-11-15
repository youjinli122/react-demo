import { createStore, combineReducers } from "../redux";
import logger from "./logger";

/**
 * redux中间件
 */

function applayMiddleware(logger) {
  return function (createStore) {
    return function (reducer, preloadedState) {
      let store = createStore(reducer, preloadedState);
      let dispatch;
      let middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      dispatch = logger(middlewareAPI)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}

const store = applayMiddleware(logger)(createStore)(combineReducers, {
  counter: { number: 1 },
});

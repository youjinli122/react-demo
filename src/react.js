import { wrapToVdom } from "./utils";
import Component from "./Component";
import {
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  REACT_PROVIDER,
  REACT_CONTEXT,
  REACT_MEMO,
} from "./constant";
import { shallowEquals } from "./utils";
import { useState, useMemo, useCallback } from "./react-dom";

/**
 * 创建一个虚拟dom
 * type 元素的类型 div,span,p
 * config 配置对象
 * children, 儿子一个或多个
 */
function createElement(type, config, children) {
  // console.log(type, config, children, "tttt");
  let ref;
  let key;
  if (config) {
    delete config._source;
    delete config._self;
    ref = config.ref;
    key = config.key;
    delete config.ref;
    delete config.key;
  }
  let props = config ? { ...config } : {};
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    props.children = wrapToVdom(children);
  }
  return { type, ref, key, props };
}

function createRef() {
  return { current: null };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}
function createContext() {
  let context = { $$typeof: REACT_CONTEXT };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEquals(this.props, nextProps) ||
      !shallowEquals(this.state, nextState)
    );
  }
}
function memo(type, compare = shallowEquals) {
  return {
    $$typeof: REACT_MEMO,
    type, // 函数组件
    compare,
  };
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  Fragment: REACT_FRAGMENT,
  PureComponent,
  useState,
  useMemo,
  useCallback,
};

export default React;

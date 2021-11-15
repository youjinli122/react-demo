const ADD = "add";
const DEL = "del";
export const reducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ADD:
      const index = state.arr.length - 1;
      const num = state.arr[index] + 1;
      state.arr.push(num);
      return {
        ...state,
      };
    case DEL:
      state.arr.splice(state.arr.length - 1, 1);
      return {
        ...state,
      };
    case "loading":
      state.show = !state.show;
      return {
        ...state,
      };
  }
};

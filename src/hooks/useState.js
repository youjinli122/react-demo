import React from "../react";

const Counter = (props) => {
  const [number1, setNumber1] = React.useState(0);
  //   const [number2, setNumber2] = React.useState(10);
  const handlClick = () => {
    debugger;
    setNumber1(number1 + 1);
    // setNumber2(number2 + 10);
  };
  return (
    <div>
      <p>{number1}</p>
      <button onClick={handlClick}>加</button>
    </div>
  );
};

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { number: 1 };
//   }
//   handlClick = () => {
//     this.setState({ number: this.state.number + 1 });
//   };
//   render() {
//     return (
//       <div>
//         <p>{this.state.number}</p>
//         <button onClick={this.handlClick}>+</button>
//       </div>
//     );
//   }
// }

export default Counter;

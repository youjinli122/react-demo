import React from "react";

const Main = ({ arr }) => (
  <ul>
    {arr.map((r) => (
      <li key={`${r}rol`}>{r}</li>
    ))}
  </ul>
);

export default Main;

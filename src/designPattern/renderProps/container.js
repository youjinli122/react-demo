import React, { useState, useMemo } from "react";

const Container = ({ children }) => {
  const [loading, setShowLoading] = useState(false);
  const renderChild = useMemo(
    () =>
      typeof children === "function" ? children({ setShowLoading }) : null,
    [children]
  );

  return (
    <>
      {renderChild}
      {loading && (
        <>
          <div>我得现身了</div>
        </>
      )}
    </>
  );
};

export default Container;

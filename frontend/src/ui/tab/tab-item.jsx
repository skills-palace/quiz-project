import React from "react";

const TabItem = ({ children, className, tabKey }) => {
  return (
    <div key={tabKey} className={className}>
      {children}
    </div>
  );
};

export default TabItem;

import React from "react";

const AccordionItem = ({ tabKey, active, head, children, className }) => {
  return (
    <div className={className}>
      {head}
      {active.includes(tabKey) && children}
    </div>
  );
};

export default AccordionItem;

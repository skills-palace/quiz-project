import { useState } from "react";

const Accordion = ({ activeTab, className, render }) => {
  const [active, setActive] = useState([activeTab]);

  const toggle = (id) => {
    setActive((prev) => {
      const temp = [...prev];
      if (temp.indexOf(id) < 0) {
        return [...temp, id];
      } else {
        temp.splice(temp.indexOf(id));
        return temp;
      }
    });
  };
  return <div className={className}>{render({ active, toggle })}</div>;
};

export default Accordion;

import { useState, Children } from "react";

const Tab = ({
  activeTab = "",
  render,
  children,
  className = "w-full",
  bodyClass = "",
}) => {
  const [active, setCollaps] = useState(activeTab);
  const setActive = (key) => {
    setCollaps(key);
  };

  return (
    <div className={className}>
      {render(active, setActive)}
      <div className={bodyClass}>
        {Children.map(children, (child) => {
          if (child.props.tabKey === active) return child;
        })}
      </div>
    </div>
  );
};

export default Tab;

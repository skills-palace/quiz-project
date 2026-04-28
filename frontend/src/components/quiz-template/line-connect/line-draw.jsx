import React, { useEffect, useState } from "react";

const LineDraw = ({ ref1, ref2 }) => {
  const [ordinate, setOrdinate] = useState({ x1: 0, y1: 0, x2: 0, y3: 0 });

  const setOrdinateFn = () => {
    if (!ref1 || !ref2) return;
    const x1 = ref1.offsetLeft + ref1.offsetWidth / 2;
    const y1 = ref1.offsetTop + ref1.offsetHeight / 2;
    const x2 = ref2.offsetLeft + ref2.offsetWidth / 2;
    const y3 = ref2.offsetTop + ref2.offsetHeight / 2;
    setOrdinate({ x1, y1, x2, y3 });
  };

  useEffect(() => {
    setOrdinateFn();
  }, []);

  useEffect(() => {
    const updateOrginates = () => {
      setOrdinateFn();
    };
    window.addEventListener("resize", updateOrginates);
    window.addEventListener("scroll", updateOrginates, true);
    return () => {
      window.removeEventListener("resize", updateOrginates);
      window.removeEventListener("scroll", updateOrginates, true);
    };
  }, []);

  return (
    <line
      x1={ordinate.x1}
      y1={ordinate.y1}
      x2={ordinate.x2}
      y2={ordinate.y3}
      stroke="#e41f88"
      strokeWidth={"4px"}
      strokeLinecap="round"
    />
  );
};

export default LineDraw;

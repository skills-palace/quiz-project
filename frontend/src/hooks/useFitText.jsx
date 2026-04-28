import { useEffect, useRef, useState } from "react";

const useFitText = () => {
  const textRef = useRef();
  const parentRef = useRef();

  useEffect(() => {
    //let size_div = document.querySelector("#font_size");
    //let div = document.querySelector("#fixed");
    const element = parentRef.current;
    element.style.fontSize = element.offsetWidth * 0.5 + "%";
    //element.style.fontSize = 1 + "px";
    // var w = element.offsetWidth;
    // var h = element.offsetHeight;
    // var x = w > 122 ? 122 / w : 1;
    // var y = h > 122 ? 122 / h : 1;
    // var r = Math.min(x, y) * 20;
    // textRef.current.style.fontSize = r + "px";
    //size_div.innerHTML = "&nbsp;" + div.style.fontSize;


    


  }, []);

  return { textRef, parentRef };
};

export default useFitText;

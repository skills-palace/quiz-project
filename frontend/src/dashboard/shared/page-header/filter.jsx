import { useState } from "react";
import useOutSideClick from "@/hooks/useOutSideClick";
import { AnimatePresence, motion } from "framer-motion";
import { BiFilterAlt } from "react-icons/bi";

const Filter = ({children}) => {
  const [toggle, setToggle] = useState(false);
  const { ref } = useOutSideClick(() => setToggle(false));

  const animate = {
    initial: {
      opacity: 0,
      y: "50px",
    },
    animate: {
      opacity: 1,
      y: "0px",
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: "50px",
      transition: {
        ease: "easeIn",
        duration: 0.3,
      },
    },
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setToggle((prev) => !prev)}
        className="button bg-white w-full rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100text-gray-600  focus:border-blue-500 radius-round h-9 px-3 py-2 text-sm"
      >
        <span className="flex items-center justify-center">
          <BiFilterAlt className="w-5 h-5 mr-1 text-gray-600" />
          <span className="mr-1">Filter</span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {toggle && (
          <motion.div
            key="filter-modal"
            variants={animate}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-10 absolute top-10 left-0 w-56 bg-white rounded-lg shadow"
          >
          {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;

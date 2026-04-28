import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOutSideClick from "@/hooks/useOutSideClick";

const Index = ({ renderHeader, children }) => {
  const [active, setActive] = useState(false);
  const { ref } = useOutSideClick(() => setActive(false));

  const toggle = () => {
    setActive((prev) => !prev);
  };

  const animate = {
    initial: {
      opacity: 0,
      scale: 0.7,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        ease: "easeOut",
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: {
        ease: "easeIn",
        duration: 0.15,
      },
    },
  };

  return (
    <div className="relative w-full" ref={ref}>
      {renderHeader(active, toggle)}
      <AnimatePresence>
        {active && (
          <motion.div
            variants={animate}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded shadow-md w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

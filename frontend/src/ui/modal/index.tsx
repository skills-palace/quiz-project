import { motion, AnimatePresence } from "framer-motion";
import { BiX } from "react-icons/bi";

interface IProps {
  title?: string;
  children: JSX.Element | JSX.Element[];
  isOpen: Boolean;
  className?: string;
  bodyClass?: string;
  //toggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
}

const Modal: React.FC<IProps> = ({
  title = "",
  children,
  bodyClass = "p-2",
  className = "max-w-7xl",
  isOpen,
  toggle,
}) => {
  const animate = {
    initial: {
      opacity: 0,
      scale: 0.8,
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
      scale: 0.8,
      transition: {
        ease: "easeIn",
        duration: 0.15,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="overflow-y-auto overflow-x-hidden fixed z-[9999] inset-0 w-screen h-screen bg-gray-600 bg-opacity-30"
        >
          <div
            className={`relative left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 p-4 w-full h-full max-h-screen md:h-auto ${className}`}
          >
            {/* <!-- Modal content --> */}
            <motion.div
              variants={animate}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative bg-white rounded-lg shadow"
            >
              {/* <!-- Modal header --> */}
              <div className="flex justify-between items-center p-2 rounded-t border-b">
                <h3 className="text-md font-medium text-gray-900">{title}</h3>
                <button
                  type="button"
                  className="text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                  onClick={toggle}
                >
                  <BiX className="text-2xl text-gray-500" />
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className={`max-h-[90vh] overflow-auto ${bodyClass}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

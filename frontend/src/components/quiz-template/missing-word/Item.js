import { Textfit } from "react-textfit";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

/**
 * @param {{ item: object, variant?: 'bank' | 'blank', onActivate?: () => void, isSelected?: boolean }} props
 */
function Item({ item, variant = "bank", onActivate, isSelected }) {
  const quizTitleDirection = detectDirection(item.title);

  const base =
    quizTitleDirection === "rtl"
      ? "text-black px-2 py-1.5 sm:py-2 w-maxinline-block font-naskh text-gray-800 leading-snug md:leading-loose font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
      : "text-black px-2 py-1.5 sm:py-2 w-maxinline-block font-sans text-gray-800 leading-snug md:leading-loose font-semibold text-base sm:text-lg md:text-xl lg:text-2xl";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onActivate?.();
      }}
      className={`${base} inline-block cursor-pointer rounded-md border-2 border-transparent text-left transition touch-manipulation select-none md:hover:text-blue-600 active:bg-sky-200/60 active:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        isSelected
          ? "border-sky-500 bg-sky-100/80 ring-1 ring-sky-300"
          : "md:hover:border-sky-200"
      } ${variant === "blank" ? "h-full min-h-0 w-full" : "min-h-11 sm:min-h-12 lg:min-h-0"}`}
    >
      <Textfit mode="multi">
        <Text direction={quizTitleDirection}>{item.title}</Text>
      </Textfit>
    </button>
  );
}

export default Item;

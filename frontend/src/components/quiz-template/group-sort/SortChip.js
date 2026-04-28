import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import cn from "classnames";

/**
 * Tappable label chip. Laid out for horizontal flow with siblings (group-sort bank / groups).
 */
export default function SortChip({ item, isItemArmed, onItemClick }) {
  const quizTitleDirection = detectDirection(item.title);
  return (
    <div className="inline-flex max-w-full min-w-0 shrink-0 items-stretch">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onItemClick();
        }}
        className={cn(
          "max-w-[min(20rem,90vw)] min-h-11 shrink-0 touch-manipulation rounded px-3 py-2 text-left text-sm shadow-sm transition select-none active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:min-h-12 sm:text-base md:active:scale-100 md:min-h-0 md:py-1.5",
          quizTitleDirection === "rtl"
            ? "font-medium font-naskh sm:text-lg md:text-lg"
            : "font-medium font-sans sm:text-lg md:text-lg",
          isItemArmed
            ? "bg-amber-100 ring-2 ring-amber-500 ring-offset-1"
            : "md:hover:bg-sky-50/90"
        )}
      >
        <Text direction={quizTitleDirection} className="whitespace-nowrap">
          {item.title}
        </Text>
      </button>
    </div>
  );
}

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Textfit } from "react-textfit";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

function Item({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    //transition,
    opacity: isDragging ? 0 : 1,
  };

  const quizTitleDirection = detectDirection(item.title);
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`${quizTitleDirection==='rtl'
      ? "bg-blue-500 hover:bg-blue-600 text-center px-5 py-1 m-1 text-white rounded w-maxinline-block font-naskh text-[20px]"
      :"bg-blue-500 hover:bg-blue-600 px-4 py-1 m-1  text-white rounded w-maxinline-block font-sans font-medium text-[18px]"}`}>
      
        <Textfit mode="multi">
          <Text direction={quizTitleDirection}>{item.title}</Text>
        </Textfit>
      </div>
    </div>
  );
}

export default Item;

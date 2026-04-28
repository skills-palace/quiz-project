import Alert from "@/ui/alert";
import Group from "./group";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const GroupSort = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className={`${quizTitleDirection==='rtl'? "mb-4 bg-sky-100 shadow-md p-2 rounded text-[20px] font-naskh":
      "mb-4 bg-sky-100 shadow-md p-2 rounded text-[20px] font-sans"}`}>
   
      <Text
        direction={quizTitleDirection}
        className={`${quizTitleDirection==='rtl'? "mb-2 text-[20px] font-naskh font-bold":
          " mb-2 text-[20px] font-sans font-semibold"}`}>
       
      {`${idx + 1}. ${quiz.title}`}</Text>

      <div className={`${quizTitleDirection==='rtl'? "grid grid-cols-2 gap-2 text-[20px] font-naskh font-bold":
      "grid grid-cols-2 gap-2 text-[16px] font-sans"}`}>
      
      
        {quiz.quiz_items.map((group, idx) => {
          const quizTitleDirection = detectDirection(group.name);
          return (
            <div key={idx} className="col-md-6">
              <Text direction={quizTitleDirection}>{group.name}</Text>
              <Group group={group} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupSort;

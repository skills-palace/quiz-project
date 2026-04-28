import cn from "classnames";

import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
function Layout9({ quiz, idx }) {
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text
        direction={quizTitleDirection}
        className={`${quizTitleDirection==='rtl'? "mb-1 text-[20px] font-naskh font-bold":
          "mb-1 text-[20px] font-sans font-semibold"}`}>
        
        {`${idx + 1}. ${quiz.title}`}</Text>
      <div className="question_wrapper">
        <div className={`${quizTitleDirection==='rtl'? "flex justify-between border rounded p-1 text-[20px] font-naskh font-semibold":
          "flex justify-between border rounded  text-[20px] font-sans "}`}>
        
          <div className="q_left">
            <h2 className="">{quizTitleDirection === "rtl" ? "الْجُمَلْ" : "Sentenses"}</h2>
          </div>
          <div className="flex gap-2 ">
            <div className="mr-2 ">
              <h2 className={`${quizTitleDirection==='rtl'? "flex justify-between border rounded  text-[20px] font-naskh ":
          "flex justify-between border rounded  text-[20px] font-sans "}`}>
                {" "}
                {quizTitleDirection === "rtl" ? "صَحْ" : "True"}{" "}
              </h2>
            </div>
            
            <div className="">
              <h2 className={`${quizTitleDirection==='rtl'? "flex justify-between border rounded  text-[20px] font-naskh ":
          "flex justify-between border rounded  text-[20px] font-sans "}`}>
                {" "}
                {quizTitleDirection === "rtl" ? "خَطَأْ" : "False"}
              </h2>
            </div>
          </div>
        </div>

        <div  className={`${quizTitleDirection==='rtl'? " text-[20px] font-naskh":
              "text-[16px] font-sans"}`}>
         
          {quiz.quiz_items.map((item, idx) => {
            const quizTitleDirection = detectDirection(item.title);
            return (
              <div
                key={idx}
                className={`${cn({
                  "bg-red-400 text-white": item.status === 0,
                  "bg-green-600 text-white": item.status === 1,
                  "bg-gray-100 text-black": item.status === 2,
                })} flex justify-between p-2 rounded my-2`}
              >
                <div className="q_left">
                  <Text direction={quizTitleDirection}>{item.title}</Text>
                </div>

                <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center">
                  <div className="flex">
                    <div className="w-9">
                      <input type="radio" readOnly checked={item.answer === true} />
                    </div>
                    <div className="w-9">
                      <input type="radio" readOnly checked={item.answer === false} />
                    </div>
                  </div>
                  {item.correctValue !== undefined && item.correctValue !== null && (
                    <span
                      className={`rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-900 ${
                        quizTitleDirection === "rtl" ? "font-naskh" : "font-sans"
                      }`}
                    >
                      {quizTitleDirection === "rtl" ? "الصحيح: " : "Correct: "}
                      {item.correctValue
                        ? quizTitleDirection === "rtl"
                          ? "صح"
                          : "True"
                        : quizTitleDirection === "rtl"
                          ? "خطأ"
                          : "False"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Layout9;

export type QuizItem = {
  id: string;
  title: string;
  mark: string;
  answer: string;
};

export type Quiz = {
  title: string;
  status: string;
  type: string;
  description: string;
  quizes: QuizItem[];
};

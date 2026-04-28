import { determineAnswer } from './determineAnswer';

// Helper function to generate MongoDB-like IDs
function generateObjectId() {
  return (
    Math.random().toString(16).substr(2, 8) +
    Math.random().toString(16).substr(2, 8) +
    Date.now().toString(16).substr(-8)
  );
}

export function formatQuizData(rawQuiz: string, questionConfig: any[]) {
  const sections = rawQuiz.split(/\n\n(?=[A-Za-z])/); // Split into sections for each question type
  const formattedQuizzes: {
    id: string; // Add ID to each formatted quiz
    title: string;
    type: any;
    status: string;
    description: string;
    quizes: {
      id: string; // Add ID to each individual quiz
      title: string; // Remove question number
      mark: number;
      answer: string | boolean | null;
    }[];
  }[] = [];

  questionConfig.forEach((config, index) => {
    const section = sections[index];
    if (!section) return;

    const [title, ...questions] = section.split(/\n(?=\d+\. )/); // First line is title
    const parsedQuestions = questions.map((question) => {
      const [questionText, ...options] = question.split(/\n/);
      const mark = 1; // Assign default mark
      const answer = determineAnswer(questionText); // Implement logic to extract answers

      return {
        id: generateObjectId(), // Generate unique ID for each question
        title: questionText.replace(/^\d+\.\s*/, '').trim(), // Remove question number
        mark,
        answer,
      };
    });

    formattedQuizzes.push({
      id: generateObjectId(), // Generate unique ID for each formatted quiz
      title: title.trim(),
      type: config.type,
      status: '1',
      description: title,
      quizes: parsedQuestions,
    });
  });

  return formattedQuizzes;
}

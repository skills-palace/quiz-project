import React from 'react';

import AddQuiz from '@/dashboard/quiz/add';
import Layout from '@/layout/dashboard';

const QuizCreate = () => {
  return (
    <div>
      <AddQuiz />
    </div>
  );
};

QuizCreate.Layout = Layout;

export default QuizCreate;

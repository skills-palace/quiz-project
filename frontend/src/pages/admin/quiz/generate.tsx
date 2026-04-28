import { useEffect, useState } from 'react';
import { ContentCreator } from '@/dashboard/quiz/content-creator';
import Layout from '@/layout/dashboard';
import { useGetItemsQuery } from '@/redux/api/quiz-api';
const CreateQuizPage = () => {
  const { data = { result: [], total: 0 }, isFetching } = useGetItemsQuery({});

  return (
    <div className="p-6">
      <ContentCreator />
    </div>
  );
};
CreateQuizPage.Layout = Layout;
export default CreateQuizPage;

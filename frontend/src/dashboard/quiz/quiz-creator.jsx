import { useState } from 'react';
import { useGenerateQuizMutation } from '@/redux/api/quiz-api';
import { useRouter } from 'next/router';
import Alert from '@/ui/alert';

const questionTypes = [
  { type: 'multiple_choice', display: 'Multiple Choice', maxQuestions: 5 },
  { type: 'true_false', display: 'True/False', maxQuestions: 5 },
  { type: 'missing_word', display: 'Missing Word', maxQuestions: 5 },
  { type: 'line_connect', display: 'Line Connect', maxQuestions: 5 },
  { type: 'group_sort', display: 'Group Sort', maxQuestions: 5 },
  { type: 'classification', display: 'Classification', maxQuestions: 5 },
  { type: 'rearrange', display: 'Rearrange', maxQuestions: 5 },
  { type: 'word_bank', display: 'Word bank', maxQuestions: 5 },
  { type: 'highlight_word', display: 'Highlight Word', maxQuestions: 5 },
  { type: 'reorder', display: 'Reorder', maxQuestions: 5 },
  { type: 'blank_space', display: 'Blank Space', maxQuestions: 5 },
  { type: 'math', display: 'Math', maxQuestions: 0 },
];

export function QuizCreator({ content }) {
  const [generateQuiz, { isLoading, isError, error }] =
    useGenerateQuizMutation();
  const [language, setLanguage] = useState('English');
  const [selectedCounts, setSelectedCounts] = useState(
    Object.fromEntries(questionTypes.map((q) => [q.type, 0])) // Initialize counts to 0
  );
  const router = useRouter();

  const handleCountChange = (type, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [type]: parseInt(value),
    }));
  };

  const handleGenerate = async () => {
    const questionConfig = Object.entries(selectedCounts)
      .filter(([_, count]) => count > 0) // Only include types with non-zero count
      .map(([type, limit]) => ({ type, limit }));

    const formData = new FormData();
    formData.append('language', language);
    formData.append('content', content);
    formData.append('maxQuestionsType', questionConfig.length.toString());
    questionConfig.forEach((config, index) => {
      formData.append(`questionConfig[${index}][type]`, config.type);
      formData.append(`questionConfig[${index}][limit]`, config.limit);
    });

    try {
      console.log('formData', formData);
      await generateQuiz(formData).unwrap();
      router.push('/admin/quiz'); // Redirect to /quiz after success
    } catch (err) {
      console.error('Failed to generate the quiz:', err);
    }
  };

  return (
    <div>
      {isError && (
        <Alert message={error?.data?.message ?? 'Something went wrong'} />
      )}
      <div className="w-full max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Generate Quiz</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-[200px] bg-[#F8F7FF] border border-gray-300 rounded-md px-3 py-2"
            >
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4 mb-4 font-medium">
              <div>Question Type</div>
              <div>Max Questions</div>
            </div>

            {questionTypes.map((q) => (
              <div
                key={q.type}
                className="grid grid-cols-2 gap-4 items-center mb-3"
              >
                <div className="bg-[#F8F7FF] p-3 rounded-md text-[15px]">
                  {q.display}
                </div>
                <select
                  value={selectedCounts[q.type]}
                  onChange={(e) => handleCountChange(q.type, e.target.value)}
                  className="w-20 bg-[#F8F7FF] border border-gray-300 rounded-md px-2 py-1"
                >
                  {[...Array(q.maxQuestions + 1)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                isLoading ? 'bg-gray-400' : 'bg-[#0072F5] hover:bg-[#0072F5]/90'
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

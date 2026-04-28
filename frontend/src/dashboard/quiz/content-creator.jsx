import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizCreator } from './quiz-creator';
import { useForm } from 'react-hook-form';
import TextEditor from '@/ui/hook-form/text-editor';

const tabs = ['Text', 'Document', 'Image', 'Video'];

export function ContentCreator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Text');
  const [generatePage, setGeneratePage] = useState(false);
  const [file, setFile] = useState(null);
  
  const { control, watch } = useForm({
    defaultValues: {
      content: ''
    }
  });

  // Watch the content field for character count
  const content = watch('content');
  
  // Strip HTML tags for character count
  const getPlainTextLength = (html) => {
    if (!html) return 0;
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent.length;
  };

  const handleNext = () => {
    setGeneratePage(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFile(null);
  };

  const FileUploadUI = ({ acceptTypes, label }) => (
    <div className="flex flex-col items-center justify-center h-full">
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 text-base leading-normal">
          Select {label}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptTypes}
        />
      </label>
      {file && (
        <p className="mt-4 text-sm text-gray-600">
          Selected file: {file.name}
        </p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Text':
        return (
          <div className="min-h-[350px]">
            <TextEditor
              control={control}
              name="content"
              rules={{
                required: "Content is required"
              }}
            />
          </div>
        );

      case 'Document':
        return <FileUploadUI acceptTypes=".pdf,.doc,.docx" label="a document" />;
        
      case 'Image':
        return <FileUploadUI acceptTypes="image/*" label="an image" />;
        
      case 'Video':
        return <FileUploadUI acceptTypes="video/*" label="a video" />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {generatePage ? (
        <QuizCreator content={content} />
      ) : (
        <div className="bg-white shadow-sm rounded-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex space-x-1 bg-[#F8F7FF] rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Options
            </button>
          </div>
          <div className="p-4">
            <div className="min-h-[400px] bg-[#F8F7FF] rounded-lg p-4">
              {renderTabContent()}
            </div>
          </div>
          <div
            className={`flex ${
              activeTab === 'Text' ? 'justify-between' : 'justify-end'
            } items-center p-4`}
          >
            {activeTab === 'Text' && (
              <span className="text-sm text-gray-500">
                {getPlainTextLength(content)}/20,000 characters
              </span>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#0066FF] text-white rounded-md hover:bg-[#0066FF]/90 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
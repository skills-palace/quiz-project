import TextEditor from '@/ui/hook-form/text-editor';
import { FormProvider, useForm } from 'react-hook-form';
import QuizLayouts from './layouts';
import { BtnBlue } from '@/dashboard/shared/btn';
import BasicInfo from './basic-info';
import { Label, Input, ErrorMessage } from '@/ui/hook-form';
import { useState } from 'react';
import { BASE_URL } from '@/config/urls';

const Form = ({
  onSubmit,
  defaultValues,
  onRemoveAudio,
  btnTitle,
  onRemoveQuestionAudio,
  isLoading,
}) => {
  const methods = useForm({
    shouldUnregister: true,
    mode: 'all',
    defaultValues,
  });

  const [audioRemoved, setAudioRemoved] = useState(false);
  const [questionAudioRemoved, setQuestionAudioRemoved] = useState(false); // New state for question audio removal

  const handleRemoveAudio = () => {
    onRemoveAudio();
    methods.setValue('audioPath', '');
    setAudioRemoved(true);
  };

  const handleRemoveQuestionAudio = () => {
    onRemoveQuestionAudio();
    methods.setValue('questionAudio', ''); // Reset question audio value
    setQuestionAudioRemoved(true); // Update state
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      methods.setValue('questionAudio', files[0]); // Set only the first file
    } else {
      methods.setValue('questionAudio', ''); // Reset if no file selected
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <BasicInfo />

        <div className="my-2">
          <QuizLayouts />

          {/* Audio Upload Section */}
          <div className="mt-4">
            <Label htmlFor="audioPath">Audio</Label>

            {/* Display existing audio if available and not removed */}
            {defaultValues.audioPath && !audioRemoved ? (
              <div className="flex items-center space-x-4">
                <audio
                  controls
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${defaultValues.audioPath}`}
                />
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="text-red-600 hover:underline"
                >
                  Remove Audio
                </button>
              </div>
            ) : (
              <Input
                register={methods.register('audioPath')}
                type="file"
                id="audioPath"
                accept="audio/*"
              />
            )}

            {/* Question Audio Upload Section */}
            <Label htmlFor="questionAudio">Question Audio</Label>
            {defaultValues.questionAudio && !questionAudioRemoved ? (
              <div className="flex items-center space-x-4">
                <audio
                  controls
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${defaultValues.questionAudio}`}
                />
                <button
                  type="button"
                  onClick={handleRemoveQuestionAudio} // Remove question audio
                  className="text-red-600 hover:underline"
                >
                  Remove Question Audio
                </button>
              </div>
            ) : (
              <Input
                type="file"
                register={methods.register('questionAudio')}
                id="questionAudio"
                accept="audio/*"
                // onChange={handleFileChange} // Use custom handler
              />
            )}
            <ErrorMessage error={methods.formState.errors.questionAudio} />
          </div>

          <div className="mt-4">
            <p>Description</p>
            <TextEditor control={methods.control} name="description" />
          </div>

          <div className="mt-4 text-end border border-slate-300 rounded-md px-2 py-4 bg-white shadow-md">
            <BtnBlue type="submit">
              {isLoading ? 'submitting...' : btnTitle}
            </BtnBlue>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;

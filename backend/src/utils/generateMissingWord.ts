import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateMissingWord(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    // Generate a prompt for OpenAI
    const prompt = `
      Generate ${limit} only one short sentence with a missing word quiz based on the following content in ${language}:
      ${content}

      Each sentence should:
      1. Include one blank space (____) where the word is missing.
      2. Provide the correct word for the blank.
      3. Provide three incorrect choices as distractors.
      4. Maintain proper grammar and sentence structure.
      5. The sentence must be original from text comprehension.

      Example output format:
      Sentence: Laila heard a _____ sound in the meadow.
      Correct Words: ["soft"]
      Wrong Words: ["loud", "angry", "distant"]
    `;

    // Use OpenAI to generate the questions
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating missing word quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate missing word questions. Please try again.',
      });
      return;
    }

    // Process and format the generated quiz
    const formattedQuestions = rawQuiz
      .split(/\n\n|\n/) // Split by either double or single newlines
      .filter((line) => line.trim().length > 0);

    const quizObject: { [key: string]: any } = {
      title: 'Fill in the blank with the correct word',
      status: '1',
      type: 'missing_word',
      description: content,
      quizes: [],
    };

    formattedQuestions.forEach((block, index, array) => {
      if (index % 3 === 0) {
        const sentenceLine = block;
        const correctWordsLine = array[index + 1];
        const wrongWordsLine = array[index + 2];

        if (!sentenceLine || !correctWordsLine || !wrongWordsLine) {
          console.error('Malformed block:', {
            sentenceLine,
            correctWordsLine,
            wrongWordsLine,
          });
          return;
        }

        const sentence = sentenceLine.split(':')[1]?.trim().replace(/"/g, '');
        const correctWords = JSON.parse(
          correctWordsLine.split(':')[1]?.trim() || '[]'
        );
        const wrongWords = JSON.parse(
          wrongWordsLine.split(':')[1]?.trim() || '[]'
        );

        if (!sentence || !correctWords.length || !wrongWords.length) {
          console.error('Invalid sentence or words:', {
            sentence,
            correctWords,
            wrongWords,
          });
          return;
        }

        const sentenceParts = sentence.split('_____');

        sentenceParts.forEach((part, idx) => {
          if (part.trim()) {
            quizObject.quizes.push({
              id: generateUniqueId(),
              title: part.trim(),
              type: 'text',
              mark: '0',
            });
          }

          if (idx < correctWords.length) {
            quizObject.quizes.push({
              id: generateUniqueId(),
              title: correctWords[idx],
              type: 'word',
              mark: '1',
            });

            wrongWords.forEach((wrongWord) => {
              quizObject.quizes.push({
                id: generateUniqueId(),
                title: wrongWord,
                type: 'wrong_word',
                mark: '0',
              });
            });
          }
        });
      }
    });

    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating missing word quiz:', error);
    next(error);
  }
}

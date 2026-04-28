import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

type QuizItem = {
  id: string;
  title: string[];
  type: 'text' | 'word';
  mark: string;
};

type QuizObject = {
  title: string;
  status: string;
  type: string;
  description: string;
  quizes: QuizItem[];
};
export async function generateBlankSpace(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    const prompt = `
      Generate ${limit} blank spaces question from text comprehension.
      Use the content provided in ${language}: ${content}

       sentence must:
      1. Contain only one blank spaces represented by underscores (___).
      2. Provide the correct word for each blank space directly in the sentence.
      3. The sentence must be from Text Comprehension.
      4. The sentence must not exceed 10 words.
      Example format:
      Sentence 1: "The ___ Tower, located in ___, is one of the most famous landmarks in the world."
      Blanks 1: [["Eiffel"], ["Paris"]]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating blank space quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;
    console.log('Raw Quiz:', rawQuiz);

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate blank space quiz. Please try again.',
      });
      return;
    }

    // Split the raw quiz into lines and filter out empty ones
    const lines = rawQuiz.split('\n').filter(Boolean);

    const quizPayloads: QuizObject[] = [];
    let currentSentence = '';
    let currentBlanks: string[][] = [];

    lines.forEach((line) => {
      if (line.startsWith('Sentence')) {
        // Extract the sentence content
        currentSentence = line.split(':')[1]?.trim().replace(/"/g, '');
      } else if (line.startsWith('Blanks')) {
        // Extract the blanks as an array of arrays
        currentBlanks = JSON.parse(line.split(':')[1]?.trim() || '[]');

        if (currentSentence && currentBlanks.length) {
          // Split the sentence into parts around the blanks
          const sentenceParts = currentSentence.split('___');

          // Prepare quiz items for the current sentence
          const quizItems: QuizItem[] = [];

          sentenceParts.forEach((part, idx) => {
            if (part.trim()) {
              // Add fixed text
              quizItems.push({
                id: generateUniqueId(),
                title: [part.trim()],
                type: 'text',
                mark: '0',
              });
            }

            if (idx < currentBlanks.length) {
              // Add the correct word in place of the blank
              quizItems.push({
                id: generateUniqueId(),
                title:
                  currentBlanks[idx]?.map((word: string) => word.trim()) || [],
                type: 'word', // The word will be shown as a blank space on the frontend
                mark: '1',
              });
            }
          });

          // Create a quiz object for the current sentence
          quizPayloads.push({
            title: 'Fill in the blank with the correct word',
            status: '1',
            type: 'blank_space',
            description: content,
            quizes: quizItems,
          });

          // Reset for the next sentence
          currentSentence = '';
          currentBlanks = [];
        }
      }
    });

    // Store each quiz payload in the database
    for (const quizPayload of quizPayloads) {
      await quizController.generateStore(
        { body: quizPayload, user: req.user } as any,
        res as any,
        next
      );
    }
  } catch (error) {
    console.error('Error generating blank space quiz:', error);
    next(error);
  }
}

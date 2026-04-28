import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';
import { QuizItem, Quiz } from '../types/types';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
export async function generateTrueFalse(
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
      Generate ${limit} true/false questions from text comprehension based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A question text.
      2. The correct answer explicitly mentioned in the format: Answer: [true/false].
      3. Write short sentences from text comprehension of no more than 6 words.
      4. Number of phrases (3-5 phrases only).
      Example:
      Question: Photosynthesis is the process by which plants use sunlight to synthesize food.
      Answer: true

      Question: The capital of France is Berlin.
      Answer: false
      
      Ensure the answers are only "true" or "false" without additional text or explanations.
    `;

    // Use OpenAI to generate the questions
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating true/false questions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate true/false questions. Please try again.',
      });
      return;
    }

    const formattedQuestions = rawQuiz
      .split(/\n\s*\n|\n/) // Split by either '\n\n' or '\n' with optional spaces
      .filter((line) => line.trim().length > 0);

    console.log('formattedQuestions', formattedQuestions);

    // Initialize the quiz object
    const quiz: Quiz = {
      title:
        'Put ✓ in front of the correct sentence and ✘ in front of the incorrect sentence:',
      status: '1',
      type: 'true_false',
      description: content, // Use the content of the test as description
      quizes: [],
    };

    // Iterate over `formattedQuestions` in pairs
    for (let i = 0; i < formattedQuestions.length; i += 2) {
      const questionText = formattedQuestions[i]
        ?.replace(/^\d+\.\s*Question:\s*|^Question:\s*/, '')
        .trim();
      const rawAnswer = formattedQuestions[i + 1]
        ?.split(':')[1]
        ?.trim()
        .toLowerCase();

      if (!questionText || (rawAnswer !== 'true' && rawAnswer !== 'false')) {
        throw new Error(`Invalid question or answer format at index ${i}`);
      }

      const quizItem: QuizItem = {
        id: generateUniqueId(),
        title: questionText,
        mark: '1', // Example mark
        answer: rawAnswer,
      };

      quiz.quizes.push(quizItem);
    }

    // Pass the quiz object to the `store` method in the controller
    await quizController.generateStore(
      { body: quiz, user: req.user } as any, // Pass the request body and user
      res as any, // Forward the response object
      next // Forward the next function for error handling
    );
  } catch (error) {
    next(error); // Forward any error to the error-handling middleware
  }
}

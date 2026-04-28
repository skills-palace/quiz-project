import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';
import { QuizItem, Quiz } from '../types/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateMath(
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
      Generate ${limit} math questions based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A simple math question (addition, subtraction, multiplication, or division) make sure that number of characters of question is not more than ** 40 characters**
      2. The correct answer explicitly mentioned as a **number only** in the format: Answer: [number].
      
      Example:
      Question: 2 + 2
      Answer: 4

      Question: 10 - 3
      Answer: 7
    `;

    // Use OpenAI to generate the questions
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating math questions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate math questions. Please try again.',
      });
      return;
    }

    const formattedQuestions = rawQuiz
      .split(/\n\s*\n|\n/) // Split by either '\n\n' or '\n' with optional spaces
      .filter((line) => line.trim().length > 0);

    console.log('Formatted Questions:', formattedQuestions);

    // Initialize a single quiz object with a unique ID
    const quizId = generateUniqueId();
    const quizObject: { [key: string]: Quiz } = {
      [quizId]: {
        title: 'math mid', // Static title, can be made dynamic if needed
        status: '1', // Example status
        type: 'math', // Math question type
        description: content, // Use the content of the test as description
        quizes: [], // Initialize as an empty array
      },
    };

    // Iterate over `formattedQuestions` in pairs
    for (let i = 0; i < formattedQuestions.length; i += 2) {
      const questionText = formattedQuestions[i]
        ?.replace(/^\d+\.\s*Question:\s*|^Question:\s*/, '')
        .trim();
      const answerLine = formattedQuestions[i + 1];
      const correctAnswer = answerLine?.split(':')[1]?.trim();

      if (!questionText || !correctAnswer || isNaN(Number(correctAnswer))) {
        throw new Error(
          `Invalid question or answer format at index ${i}. Ensure questions and answers follow the correct format.`
        );
      }

      // Push each question object into the `quizes` array
      quizObject[quizId].quizes.push({
        id: generateUniqueId(), // Generate a unique ID for each question
        title: questionText,
        mark: '2',
        answer: correctAnswer, // Answer field
      });
    }

    console.log('Formatted Quiz Object:', quizObject);

    // Pass the quiz object to the `store` method in the controller
    await quizController.generateStore(
      { body: quizObject[quizId], user: req.user } as any, // Pass the request body and user
      res as any, // Forward the response object
      next // Forward the next function for error handling
    );
  } catch (error) {
    next(error); // Forward any error to the error-handling middleware
  }
}

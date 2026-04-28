import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

type QuizItem = {
  id: string;
  title: string;
  mark: string;
};

type QuizObject = {
  title: string;
  status: string;
  type: string;
  description: string;
  quizes: QuizItem[];
};

export async function generateReorderQuestions(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    // Define the prompt for the OpenAI model
    const prompt = `
      Generate ${limit} reorder questions from the text comprehension based on the following content in ${language}:
      ${content}

      Each question should:
      1. Provide 4 main ideas or steps in a random order from the text comprehension.
      2. The correct order should be returned in the specified format.

       Example format:
      Jumbled main ideas: 
     "She asked what it was"
     "Luna dreamed of space" 
     "Luna saw a shiny star"
     

      Step 1: "Luna saw a shiny star"
      Step 2: "She asked what it was"
      Step 3: "Luna dreamed of space"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating reorder questions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate reorder quiz. Please try again.',
      });
      return;
    }

    const formattedQuestions = rawQuiz.split('\n').filter(Boolean);

    const quizObject: QuizObject = {
      title:
        'Arrange the following main ideas in the order they appear in the text:',
      status: '1',
      type: 'reorder',
      description: content,
      quizes: [],
    };

    formattedQuestions.forEach((line) => {
      const match = line.match(/Step \d+:\s*"([^"]+)"/);
      if (!match) {
        console.error('Malformed line:', line);
        return; // Skip invalid entries
      }

      const stepTitle = match[1];

      // Add the step as a quiz item
      quizObject.quizes.push({
        id: generateUniqueId(),
        title: stepTitle,
        mark: '1', // Each step gets a mark of 1
      });
    });

    if (!quizObject.quizes.length) {
      res.status(400).json({
        error: 'No valid steps were generated. Please try again.',
      });
      return;
    }

    // Debug output
    console.log('Formatted Reorder Quiz:', JSON.stringify(quizObject, null, 2));

    // Pass the quiz object to the store method in the controller
    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating reorder quiz:', error);
    next(error);
  }
}

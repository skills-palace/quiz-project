import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type QuizItem = {
  id: string;
  title: string;
  mark: string;
};

export type Quiz = {
  title: string;
  status: string;
  type: string;
  description: string;
  quizes: QuizItem[];
};

export async function generateRearrange(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    const prompt = `
      Generate ${limit} Reordering questions of only one sentence from the text comprehension based on the following content in ${language}:
      ${content}

      Each question should:
      1. Provide a short jumbled sentence of no more than 5 words.
      2. The correct order should be returned in the correct format.
      3. The sentence must be original from the understanding of the text

      Example:
      Jumbled Sentence: helps Teamwork solve us faster problems
      Correct Order: Teamwork helps us solve problems faster.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for generating rearranged sentence questions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error:
          'Failed to generate rearranged sentence questions. Please try again.',
      });
      return;
    }

    const formattedQuestions = rawQuiz.split('\n').filter(Boolean);

    const quizObject: Quiz = {
      title: 'Arrange the following words correctly',
      status: '1',
      type: 'rearrange',
      description: content,
      quizes: [],
    };

    formattedQuestions.forEach((line) => {
      const [jumbledSentencePart, correctOrderPart] =
        line.split('Correct Order:');
      if (!correctOrderPart) {
        console.error('Malformed line:', line);
        return; // Skip invalid entries
      }

      const correctOrder = correctOrderPart.trim();

      // Add the correct order as individual words
      correctOrder.split(' ').forEach((word) => {
        quizObject.quizes.push({
          id: generateUniqueId(),
          title: word,
          mark: '1',
        });
      });
    });

    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating rearrange quiz:', error);
    next(error);
  }
}

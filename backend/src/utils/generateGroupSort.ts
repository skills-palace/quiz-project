import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

type QuizItem = {
  id: string;
  name: string;
  items: { id: string; title: string; mark: number }[];
};

type QuizObject = {
  type: string;
  title: string;
  status: string;
  description: string;
  quizes: QuizItem[];
};

export async function generateGroupSort(
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
      Generate ${limit} group sort questions from the text comprehension based on the following content in ${language}:
      content: ${content}:
      - Each question should have two groups.
      - Each group must have a title.
      - Each group must contain between 3 items.
      - Each item must be one or two words, not a sentence.
      - The combined number of items across both groups must not exceed 6.
      Example format:
      Group: "Group Name 1"
      Items: ["Item 1", "Item 2"]
      Group: "Group Name 2"
      Items: ["Item 3", "Item 4"]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating group sort quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate group sort quiz. Please try again.',
      });
      return;
    }

    // Parse the raw quiz
    const lines = rawQuiz.split('\n').filter(Boolean);

    const quizObject: QuizObject = {
      type: 'group_sort',
      title: 'Sort this into the following groups',
      status: '1',
      description: content,
      quizes: [],
    };

    let currentGroup: QuizItem | null = null;

    for (const line of lines) {
      if (line.startsWith('Group:')) {
        // Save the previous group if it exists
        if (currentGroup) {
          quizObject.quizes.push(currentGroup);
        }
        // Start a new group
        currentGroup = {
          id: generateUniqueId(),
          name: line.split(':')[1]?.trim().replace(/"/g, ''),
          items: [],
        };
      } else if (line.startsWith('Items:')) {
        // Parse items for the current group
        const items = JSON.parse(line.split(':')[1]?.trim() || '[]');
        if (currentGroup && Array.isArray(items)) {
          currentGroup.items = items.map((item: string) => ({
            id: generateUniqueId(),
            title: item,
            mark: 1,
          }));
        }
      }
    }

    // Add the last group if it exists
    if (currentGroup) {
      quizObject.quizes.push(currentGroup);
    }

    // Validate the quiz object
    if (quizObject.quizes.length === 0) {
      res.status(400).json({
        error: 'No valid groups were generated. Please try again.',
      });
      return;
    }

    // Debug output
    console.log(
      'Formatted Group Sort Quiz:',
      JSON.stringify(quizObject, null, 2)
    );

    // Pass the quiz object to the store method in the controller
    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating group sort quiz:', error);
    next(error);
  }
}

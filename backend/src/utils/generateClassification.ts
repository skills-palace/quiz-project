import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { generateUniqueId } from './generateId';
import { quizController } from '../controllers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

type ClassificationItem = {
  id: string;
  title: string;
  mark: number;
};

type ClassificationQuiz = {
  id: string;
  name: string;
  items: ClassificationItem[];
};

type ClassificationQuizObject = {
  type: string;
  title: string;
  status: string;
  description: string;
  quizes: ClassificationQuiz[];
};

export async function generateClassification(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    // Adjust the limit to ensure it aligns with the requirement
    const adjustedLimit = limit === 1 ? 2 : limit;

    // Define the prompt for OpenAI
    const prompt = `
Generate ${limit} group sort questions from the text comprehension based on the following content in ${language}:
      content: ${content}:

      Question: classification
      Title: Sort the following words into two groups:
      - Each group has a special title.
      - The item is a single word or a sentence (two to five words).
      - The maximum number of items in both groups together is 6 items.
      - The maximum number of groups is two.
      - The minimum number of groups is two.
      - The minimum number of items in each group is two.
      - The maximum number of items in each group is 4 items.
      Content: ${content}
      Language: ${language}
      Generate ${adjustedLimit} groups for classification.

      Example format:
      Group: "Group Name animals"
      Items: ["Lion", "Dog", "Cat"]
      Group: "Group Name Birds"
      Items: ["Crow", "Ostrich", "Eagle"]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for generating classification quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate classification quiz. Please try again.',
      });
      return;
    }

    // Parse the raw quiz response
    const groups = rawQuiz.split('\n').filter(Boolean);

    const quizObject: ClassificationQuizObject = {
      type: 'classification',
      title: 'Sort the following words into two groups:',
      status: '1',
      description: content,
      quizes: [],
    };

    // Extract each group and its items
    for (let i = 0; i < groups.length; i += 2) {
      const groupLine = groups[i];
      const itemsLine = groups[i + 1];

      if (!groupLine.startsWith('Group:') || !itemsLine.startsWith('Items:')) {
        console.error('Malformed group:', { groupLine, itemsLine });
        continue;
      }

      const groupName = groupLine.split(':')[1]?.trim().replace(/"/g, ''); // Extract group name
      const items = JSON.parse(itemsLine.split(':')[1]?.trim() || '[]'); // Parse items array

      if (!groupName || !Array.isArray(items)) {
        console.error('Invalid group or items:', { groupName, items });
        continue;
      }

      // Transform items into an array of objects
      const formattedItems = items.map((item: string) => ({
        id: generateUniqueId(),
        title: item,
        mark: 1,
      }));

      quizObject.quizes.push({
        id: generateUniqueId(),
        name: groupName,
        items: formattedItems,
      });
    }

    // Debug output
    console.log(
      'Formatted Classification Quiz:',
      JSON.stringify(quizObject, null, 2)
    );

    // Pass the quiz object to the store method in the controller
    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating classification quiz:', error);
    next(error);
  }
}

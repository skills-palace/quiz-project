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
  answer: string;
  ans_id: string;
  mark: string;
};

type QuizObject = {
  type: string;
  title: string;
  status: string;
  description: string;
  quizes: QuizItem[];
};

export async function generateLineConnecting(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    // Define the updated prompt for OpenAI
    const prompt = `
    Generate ${limit} a maximum of 4 groups of words and their meanings from the text comprehension based on the following content in ${language}:
    ${content}
  
    Each group must:
    
    - Title contain only one word.
    - Answer contain very short meaning of no more than 6 words..
    
    - Use this exact format:
      Title: Word.
      Answer: Its very short meaning.
      Example:
      Title: Tree
      Answer: A tall plant with branches.
      Title: Book
      Answer: A collection of written pages.
      Title: Water
      Answer: A clear liquid for drinking.
      Title: House
      Answer: A place where people live.
  
  
    
  `;
  

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for generating line connecting quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate line connecting quiz. Please try again.',
      });
      return;
    }

    // Parse the raw quiz into lines
    const lines = rawQuiz.split('\n').filter(Boolean);

    const quizObject: QuizObject = {
      type: 'line_connect',
      title: 'Match each word with its appropriate meaning:',
      status: '1',
      description: content,
      quizes: [],
    };

    // Ensure that the number of groups does not exceed 4
    const maxGroups = 4;
    let groupCount = 0;

    // Extract each title and answer pair
    for (let i = 0; i < lines.length && groupCount < maxGroups; i += 2) {
      const titleLine = lines[i];
      const answerLine = lines[i + 1];

      if (
        !titleLine.startsWith('Title:') ||
        !answerLine.startsWith('Answer:')
      ) {
        console.error('Malformed line:', { titleLine, answerLine });
        continue;
      }

      const title = titleLine.split(':')[1]?.trim(); // Extract title
      const answer = answerLine.split(':')[1]?.trim(); // Extract answer

      if (!title || !answer) {
        console.error('Invalid title or answer:', { title, answer });
        continue;
      }

      quizObject.quizes.push({
        id: generateUniqueId(),
        title,
        answer,
        ans_id: generateUniqueId(),
        mark: '1',
      });

      groupCount++; // Increment the group count
    }

    // Log the formatted quiz for debugging
    console.log(
      'Formatted Line Connecting Quiz:',
      JSON.stringify(quizObject, null, 2)
    );

    // Store the quiz using the controller
    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating line connecting quiz:', error);
    next(error);
  }
}

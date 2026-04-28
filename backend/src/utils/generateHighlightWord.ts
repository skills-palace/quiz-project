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

export async function generateHighlightWord(
  req: Request,
  res: Response,
  next: NextFunction,
  content: string,
  language: string,
  limit: number
) {
  try {
    const prompt = `
      Generate ${limit} sets of shuffled words from the text comprehension based on the following content in ${language}:
      ${content}
      
      Each set must: 
      
      1. Contain four words, one of which is verb and four that are not.
      2. Use this exact format:
         Question: highlight_word

         Title: Identify the different word from the following
         Words: "Car, Moon, Came, House, Ran"
         Words that are verbs: ["Came", "Ran"]
         Words that are not verbs: ["Car", "Moon", "House"]

         Title: Identify the different word from the following
         Words: "Slept, Chair, Train, Drank"
         Words that are verbs: ["Drank", "Slept"]
         Words that are not verbs: ["Door", "Train", "Chair"]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for generating highlight word quizzes.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;

    if (!rawQuiz) {
      res.status(500).json({
        error: 'Failed to generate highlight word quiz. Please try again.',
      });
      return;
    }

    const formattedQuestions = rawQuiz.split('\n\n').filter(Boolean); // Split by double newlines for each block
    const quizObject: QuizObject = {
      title: 'Identify all the words that indicate verbs:',
      status: '1',
      type: 'highlight_word',
      description: content,
      quizes: [],
    };

    for (const questionBlock of formattedQuestions) {
      try {
        const lines = questionBlock.split('\n').map((line) => line.trim());

        const wordsLine = lines.find((line) => line.startsWith('Words:'));
        const homophonesLine = lines.find((line) =>
          line.startsWith('Words that are verbs:')
        );
        const nonHomophonesLine = lines.find((line) =>
          line.startsWith('Words that are not verbs:')
        );

        if (!wordsLine || !homophonesLine || !nonHomophonesLine) {
          console.error('Malformed block:', {
            wordsLine,
            homophonesLine,
            nonHomophonesLine,
          });
          continue;
        }

        const words = wordsLine
          .split(':')[1]
          ?.trim()
          .replace(/"/g, '')
          .split(',');
        const homophones = JSON.parse(
          homophonesLine.split(':')[1]?.trim() || '[]'
        );
        const nonHomophones = JSON.parse(
          nonHomophonesLine.split(':')[1]?.trim() || '[]'
        );

        if (
          !Array.isArray(words) ||
          !Array.isArray(homophones) ||
          !Array.isArray(nonHomophones)
        ) {
          console.error('Invalid data format in block:', {
            words,
            homophones,
            nonHomophones,
          });
          continue;
        }

        for (const word of words.map((w) => w.trim())) {
          const isHomophone = homophones.includes(word);
          const isNonHomophone = nonHomophones.includes(word);

          if (!isHomophone && !isNonHomophone) {
            console.error(`Word not categorized correctly: ${word}`);
            continue;
          }

          quizObject.quizes.push({
            id: generateUniqueId(),
            title: word,
            type: isHomophone ? 'word' : 'text',
            mark: isHomophone ? '1' : '0',
          });
        }
      } catch (error: any) {
        console.error(
          `Error processing question block: ${questionBlock}\nError: ${error.message}`
        );
        continue;
      }
    }

    console.log(
      'Formatted Highlight Word Quiz:',
      JSON.stringify(quizObject, null, 2)
    );

    await quizController.generateStore(
      { body: quizObject, user: req.user } as any,
      res as any,
      next
    );
  } catch (error) {
    console.error('Error generating highlight word quiz:', error);
    next(error);
  }
}

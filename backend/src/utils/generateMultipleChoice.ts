import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { quizController } from '../controllers';
import { generateUniqueId } from './generateId';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateMultipleChoice(
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
      Generate ${limit} multiple-choice questions based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A question text ( question text length must be less than or equal to 130 characters long)
      2. Four options (a, b, c, d)
      3. The correct answer explicitly mentioned in the format: Answer: [correct option].
      4. Strictly follow the example below since we gonna use according to the format!
      Example:
      1. What is the capital of France?
      a) Berlin
      b) Madrid
      c) Paris
      d) Rome
      Answer: c
      strictly do not change 'Answer:' word to any language  which is at the bottom of the options hint: i am saying only the 'Answer' word use start with 'Answer' for languaegs since we gonna format accordingly
    `;

    // Use OpenAI to generate the questions
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for generating multiple-choice questions.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const rawQuiz = response.choices[0]?.message?.content;
    console.log('rawQuiz', rawQuiz);
    if (!rawQuiz) {
      res.status(500).json({
        error:
          'Failed to generate multiple-choice questions. Please try again.',
      });
      return;
    }

    // Split by double newlines to separate question blocks
    const formattedQuestions = rawQuiz
      .split(/\n\s*\n/) // Split by '\n\n' or more with optional spaces
      .filter((block) => block.trim().length > 0);

    const quizArray = [];
    const questionSet = new Set(); // To track and avoid duplicate questions

    for (const questionBlock of formattedQuestions) {
      try {
        // Split the block into lines
        const lines = questionBlock
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (lines.length < 6) {
          console.warn(`Question block does not contain enough lines:`, lines);
          continue; // Skip blocks that don't have enough lines
        }

        const currentQuestion = lines[0]
          .replace(/^(\d+\.\s*|Question:\s*)/, '')
          .trim();
        if (questionSet.has(currentQuestion)) {
          console.warn(
            `Duplicate question detected and skipped: ${currentQuestion}`
          );
          continue; // Skip duplicate questions
        }
        questionSet.add(currentQuestion);

        const options = lines.slice(1, 5); // Extract four options
        const correctOptionLine = lines.find((line) =>
          line.toLowerCase().startsWith('answer:')
        );
        const correctOption = correctOptionLine
          ?.split(':')[1]
          ?.trim()
          ?.toLowerCase();

        if (!correctOption || !['a', 'b', 'c', 'd'].includes(correctOption)) {
          console.error(
            `Correct answer is missing or improperly formatted in block: ${questionBlock}`
          );
          continue;
        }

        const choices = options.map((option, index) => {
          const optionLetter = option.charAt(0).toLowerCase();
          const optionText =
            option.split(')')[1]?.trim() || `Option ${index + 1}`;
          const isCorrect = optionLetter === correctOption;
          return {
            id: generateUniqueId(),
            title: optionText,
            mark: isCorrect ? '1' : '0',
            answer: isCorrect ? 'true' : 'false',
            image: 'undefined',
          };
        });

        quizArray.push({
          title: currentQuestion,
          status: '1',
          type: 'multiple_choice2',
          description: content,
          quizes: choices,
        });
      } catch (error: any) {
        console.error(
          `Error processing question block: ${questionBlock}\nError: ${error.message}`
        );
        continue; // Skip invalid question blocks
      }
    }

    // Save the quizzes using the controller
    for (const quiz of quizArray) {
      try {
        await quizController.generateStore(
          { body: quiz, user: req.user } as any,
          res as any,
          next
        );
      } catch (error: any) {
        console.error(
          `Error storing quiz: ${quiz.title}\nError: ${error.message}`
        );
      }
    }
  } catch (error) {
    next(error); // Forward any error to the error-handling middleware
  }
}

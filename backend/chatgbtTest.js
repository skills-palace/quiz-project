import OpenAI from 'openai';

// Instantiate the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 

async function testModel() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a model accessible to your account
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Write a haiku about recursion in programming.',
        },
      ],
    });

    // Log the generated message
    console.log(completion.choices[0].message.content);
  } catch (error) {
    // Log error details
    console.error('Error:', error.response?.data || error.message);
  }
}

testModel();

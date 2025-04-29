import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, prompt } = body;

    // Validate input
    if (!userId || !prompt) {
      return new Response(JSON.stringify({ message: "Missing userId or prompt" }), {
        status: 400,
      });
    }

    // Get OpenAI response
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = gptResponse.choices[0].message.content;

    // Save to Supabase
    const { error } = await supabase.from('messages').insert([
      { user_id: userId, prompt, response: answer },
    ]);

    if (error) {
      console.error('Supabase error:', error.message);
      return new Response(JSON.stringify({ message: 'Failed to save message to database' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ response: answer }), {
      status: 200,
    });

  } catch (error) {
    console.error('API Route Error:', error.message || 'No message', error);
    return new Response(JSON.stringify({ message: error.message || 'Unknown error occurred' }), {
      status: 500,
    });
  }
}

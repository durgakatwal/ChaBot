
import { supabase } from '/src/app/lib/supabase' 
export async function POST(request) {
    try {
      const { message } = await request.json();
  
      const ollamaApiUrl = 'http://127.0.0.1:11434/v1/chat/completions';
  
      const ollamaResponse = await fetch(ollamaApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3', 
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      });
  
      if (!ollamaResponse.ok) {
        const errText = await ollamaResponse.text();
        console.error('Failed to fetch from Ollama:', ollamaResponse.status, errText);
        return new Response(JSON.stringify({ error: 'Failed to fetch from Ollama', detail: errText }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const data = await ollamaResponse.json();
      const answer = data.choices?.[0]?.message?.content ?? 'No answer received from Ollama.';
  
      return new Response(JSON.stringify({ answer }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in /api/chat route:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  





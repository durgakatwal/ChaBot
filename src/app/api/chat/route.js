// import { supabase } from '/src/app/lib/supabase';

// export async function POST(request) {
//   try {
//     const { message } = await request.json();

//     const ollamaApiUrl = 'http://127.0.0.1:11434/v1/chat/completions';    
//     // const ollamaApiUrl = ' https://adcb-2400-1a00-bd11-ece2-dce0-27b5-5d80-5859.ngrok-free.app/v1/chat/completions';    //using the ngrok tunnel as it was only running in local computer as i have given the localhost add so for sharing using the ngrok tunnel


//     const ollamaResponse = await fetch(ollamaApiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'llama3',
//         messages: [
//           {
//             role: 'user',
//             content: message,
//           },
//         ],
//       }),
//     });

//     if (!ollamaResponse.ok) {
//       const errText = await ollamaResponse.text();
//       console.error('Failed to fetch from Ollama:', ollamaResponse.status, errText);
//       return new Response(JSON.stringify({ error: 'Failed to fetch from Ollama', detail: errText }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await ollamaResponse.json();
//     const answer = data.choices?.[0]?.message?.content ?? 'No answer received from Ollama.';

//     // Save chat to Supabase
//     const { error: dbError } = await supabase.from('chats').insert([
//       { prompt: message, response: answer }
//     ]);

//     if (dbError) {
//       console.error('Error saving to Supabase:', dbError.message);
//     }

//     return new Response(JSON.stringify({ answer }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });

//   } catch (error) {
//     console.error('Error in /api/chat route:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }




import { supabase } from '/src/app/lib/supabase';

export async function POST(request) {
  try {
    const { message } = await request.json();

    const ollamaApiUrl = 'http://127.0.0.1:11434/v1/chat/completions';    
    // You can switch this to your ngrok tunnel if deploying

    const ollamaResponse = await fetch(ollamaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma:2b', // 👈 switched from llama3 to deepseek
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

    // Save chat to Supabase
    const { error: dbError } = await supabase.from('chats').insert([
      { prompt: message, response: answer }
    ]);

    if (dbError) {
      console.error('Error saving to Supabase:', dbError.message);
    }

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

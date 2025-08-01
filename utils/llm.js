const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

async function generateResponse(question, contextDocuments) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return generateFallbackResponse(question, contextDocuments);
    }

    const context = contextDocuments
      .map(doc => `${doc.title}: ${doc.content}`)
      .join('\n\n');

    const prompt = `You are DoveBot, a helpful assistant for Dovedale Primary School parents in Liverpool. 
Answer questions using only the provided school information. Be friendly and concise.

School Information:
${context}

Parent Question: ${question}

Answer as DoveBot:`;

    const response = await axios.post(GROQ_API_URL, {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are DoveBot, a helpful assistant for Dovedale Primary School parents. Only answer using the provided school information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return {
      text: response.data.choices[0].message.content,
      sources: contextDocuments.map(doc => ({
        title: doc.title,
        url: doc.source_url
      }))
    };

  } catch (error) {
    console.error('LLM error:', error.message);
    return generateFallbackResponse(question, contextDocuments);
  }
}

function generateFallbackResponse(question, contextDocuments) {
  if (contextDocuments.length === 0) {
    return {
      text: "I don't have specific information about that. Please contact Dovedale Primary School at 0151 722 3877 or visit www.dovedaleprimary.co.uk",
      sources: []
    };
  }

  const relevantDoc = contextDocuments[0];
  return {
    text: `Based on school information: ${relevantDoc.content}`,
    sources: [{
      title: relevantDoc.title,
      url: relevantDoc.source_url
    }]
  };
}

module.exports = {
  generateResponse
};
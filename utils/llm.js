const axios = require('axios');
const config = require('../config/llm.config');

const generateResponse = async (message, relevantContent) => {
    try {
        // Validate inputs
        if (!message) {
            throw new Error('Message is required');
        }
        if (!Array.isArray(relevantContent)) {
            console.error('Invalid relevantContent:', relevantContent);
            throw new Error('Invalid content format');
        }

        // Format content for GROQ
        const contextText = relevantContent.map(item => item.content || item).join('\n');

        const response = await axios.post(config.apiUrl, {
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: config.systemPrompt
                },
                {
                    role: "user",
                    content: `Context: ${contextText}\n\nQuestion: ${message}`
                }
            ],
            ...config.settings
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Validate response
        if (!response.data?.choices?.[0]?.message?.content) {
            console.error('Invalid GROQ response:', response.data);
            throw new Error('Invalid response from GROQ');
        }

        return {
            text: response.data.choices[0].message.content,
            sources: relevantContent.map(c => c.source).filter(Boolean)
        };
    } catch (error) {
        // Detailed error logging
        console.error('GROQ API Error Details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
            config: error.config
        });
        
        throw new Error(`LLM Error: ${error.message}`);
    }
};

module.exports = { generateResponse };
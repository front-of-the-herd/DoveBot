const axios = require('axios');
const config = require('../config/llm.config');

const generateResponse = async (message, relevantContent) => {
    try {
        const response = await axios.post(config.apiUrl, {
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: config.systemPrompt
                },
                {
                    role: "user",
                    content: `Context: ${relevantContent}\n\nQuestion: ${message}`
                }
            ],
            ...config.settings
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            text: response.data.choices[0].message.content,
            sources: relevantContent.map(c => c.source).filter(Boolean)
        };
    } catch (error) {
        console.error('GROQ API Error:', error.response?.data || error.message);
        throw new Error('Failed to generate response');
    }
};

module.exports = { generateResponse };
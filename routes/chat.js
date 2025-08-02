const express = require('express');
const router = express.Router();
const { searchKnowledgeBase } = require('../utils/search');
const { generateResponse } = require('../utils/llm');
const { isSchoolRelated, sanitizeInput } = require('../utils/validation');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sanitizedMessage = sanitizeInput(message);
    
    if (!isSchoolRelated(sanitizedMessage)) {
      return res.json({
        response: "Hi! I'm DoveBot, and I can only answer questions about Dovedale Primary School. Please ask about school hours, contact info, uniform, or other school-related topics! 🏫",
        sources: []
      });
    }

    const relevantContent = await searchKnowledgeBase(sanitizedMessage);
    console.log('Found relevant content:', relevantContent);
    
    if (relevantContent.length === 0) {
      return res.json({
        response: "I don't have information about that in my knowledge base. For more help, contact Dovedale Primary School at 0151 722 3877 or visit www.dovedaleprimary.co.uk 📞",
        sources: []
      });
    }

    const response = await generateResponse(sanitizedMessage, relevantContent);
    console.log('Generated response:', response);
    
    res.json({
      response: response.text,
      sources: response.sources
    });

  } catch (error) {
    console.error('Chat error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    res.status(500).json({ 
      error: 'Sorry, something went wrong. Please try again!' 
    });
  }
});

module.exports = router;
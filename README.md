# 🤖 DoveBot - Dovedale Primary School Assistant

An AI-powered chatbot that helps parents of Dovedale Primary School find information quickly and easily. Ask questions about school hours, uniform, meals, term dates, and more!

## ✨ Features

- **School-Specific Knowledge**: Only answers questions about Dovedale Primary School
- **Smart Search**: Finds relevant information from the school website and PDFs
- **Free to Use**: No costs for hosting or operation
- **Easy to Use**: Simple chat interface
- **Always Available**: 24/7 access to school information

## 🚀 Quick Start

### 1. Get a Free Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Create a new API key
4. Copy the API key

### 2. Set Up Environment

Create a `.env` file in the project root:

```bash
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Collect School Data

```bash
# Add comprehensive school data (recommended)
npm run add-school-data

# Or scrape the website (limited content)
npm run collect-data
```

The `add-school-data` script adds comprehensive, manually curated information about the school including term dates, uniform policy, meals, clubs, and more.

### 5. Start the Application

```bash
npm start
```

Visit `http://localhost:3000` to use DoveBot!

## 🌐 Deployment (Free)

### Render.com (Recommended)

1. Fork this repository to your GitHub account
2. Sign up at [Render.com](https://render.com) (free tier)
3. Connect your GitHub repository
4. Add your `GROQ_API_KEY` as an environment variable
5. Deploy!

The `render.yaml` file is already configured for easy deployment.

### Alternative Free Hosting Options

- **Railway**: Similar to Render, very easy setup
- **Vercel**: Great for static sites with serverless functions
- **Netlify**: Good for static sites
- **Heroku**: Free tier available (with some limitations)

## 📊 How It Works

1. **Data Collection**: The app scrapes the school website and PDFs for information
2. **Knowledge Storage**: Information is stored in a SQLite database with keyword indexing
3. **Smart Search**: When you ask a question, the app searches for relevant content
4. **AI Response**: Groq's LLM generates helpful answers based on the found information
5. **Validation**: Ensures questions are school-related only

## 🛠️ Technical Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, no setup required)
- **AI**: Groq API (free tier)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Render.com (free)

## 📝 Example Questions

Try asking DoveBot about:

- "What are the school hours?"
- "What's the uniform policy?"
- "When are the term dates?"
- "What's for lunch this week?"
- "How do I contact the school?"
- "What after-school clubs are available?"

## 🔧 Customization

### Adding More Data Sources

Edit `scripts/collect-data.js` to add more websites or data sources.

### Updating the Knowledge Base

To update the knowledge base with comprehensive school information:

```bash
npm run add-school-data
```

This will add or update all school information including term dates, policies, and activities.

### Modifying the AI Personality

Edit `config/llm.config.js` to change how DoveBot responds.

## 🚨 Important Notes

- **Free Tier Limits**: Groq has rate limits on the free tier
- **Data Accuracy**: Information comes from the school website - always verify important details
- **Privacy**: No personal data is stored
- **Contact School**: For urgent matters, contact the school directly: **0151 722 3877**

## 🤝 Contributing

This is a community project for Dovedale Primary School parents. Feel free to:

- Report bugs
- Suggest improvements
- Add new features
- Help with data collection

## 📞 Support

For technical issues or questions about this application, please contact the developer.

For school-related questions, contact Dovedale Primary School directly.

---

**Made with ❤️ for Dovedale Primary School parents**

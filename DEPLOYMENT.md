# 🚀 Deployment Guide - DoveBot

This guide will help you deploy DoveBot to Render.com for free.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account
2. **Groq API Key**: Get a free API key from [Groq Console](https://console.groq.com/)
3. **Render Account**: Sign up at [Render.com](https://render.com) (free tier)

## Step 1: Prepare Your Code

1. **Fork this repository** to your GitHub account
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dovebot.git
   cd dovebot
   ```

## Step 2: Test Locally

1. **Run the setup script**:
   ```bash
   npm run setup
   ```

2. **Add your Groq API key** to the `.env` file:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

3. **Test the application**:
   ```bash
   npm start
   ```

4. **Visit** `http://localhost:3000` to make sure everything works

## Step 3: Deploy to Render

1. **Push your changes** to GitHub:
   ```bash
   git add .
   git commit -m "Initial DoveBot setup"
   git push origin main
   ```

2. **Sign up for Render**:
   - Go to [Render.com](https://render.com)
   - Sign up with your GitHub account
   - Choose the free plan

3. **Create a new Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Choose the repository you forked

4. **Configure the service**:
   - **Name**: `dovebot` (or whatever you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**:
   - Click on "Environment" tab
   - Add the following variables:
     - `GROQ_API_KEY`: Your Groq API key
     - `NODE_ENV`: `production`

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build to complete (usually 2-3 minutes)

## Step 4: Verify Deployment

1. **Check the logs** to make sure everything deployed correctly
2. **Visit your app** at the URL provided by Render
3. **Test the chatbot** by asking a question about Dovedale Primary School

## Troubleshooting

### Common Issues

1. **Build fails**:
   - Check that all dependencies are in `package.json`
   - Ensure `render.yaml` is properly configured

2. **App crashes on startup**:
   - Check the logs in Render dashboard
   - Verify your `GROQ_API_KEY` is set correctly
   - Make sure the database can be created

3. **Chatbot doesn't respond**:
   - Verify your Groq API key is valid
   - Check that the data collection script ran successfully
   - Look at the application logs

### Getting Help

- **Render Support**: [Render Documentation](https://render.com/docs)
- **Groq Support**: [Groq Console](https://console.groq.com/)
- **GitHub Issues**: Create an issue in the repository

## Cost Breakdown

**Free Tier Limits**:
- **Render**: Free tier includes 750 hours/month
- **Groq**: Free tier includes 100 requests/minute
- **Storage**: SQLite database is included in the free tier

**Estimated Monthly Cost**: $0 (completely free!)

## Monitoring

1. **Check Render Dashboard** regularly for:
   - Service status
   - Logs
   - Resource usage

2. **Monitor Groq Usage**:
   - Visit [Groq Console](https://console.groq.com/)
   - Check your API usage
   - Upgrade if you exceed free limits

## Updates

To update your deployed application:

1. **Make changes** to your local code
2. **Test locally** first
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
4. **Render will automatically redeploy** your changes

## Security Notes

- Your Groq API key is stored securely in Render's environment variables
- No personal data is stored in the application
- The database only contains public school information
- All user inputs are sanitized

---

**🎉 Congratulations! Your DoveBot is now live and helping Dovedale Primary School parents!** 
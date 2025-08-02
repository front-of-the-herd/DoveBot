#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🤖 DoveBot Setup Script');
console.log('========================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found!');
    console.log('📝 Creating .env file...');
    
    const envContent = `# DoveBot Environment Variables
# Get your free API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
PORT=3000
`;
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file');
    console.log('⚠️  Please edit .env and add your Groq API key!');
    console.log('   Visit: https://console.groq.com/ to get a free API key\n');
} else {
    console.log('✅ .env file found');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed');
    } catch (error) {
        console.log('❌ Failed to install dependencies');
        process.exit(1);
    }
} else {
    console.log('✅ Dependencies already installed');
}

// Check if data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    console.log('📁 Creating data directory...');
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Data directory created');
} else {
    console.log('✅ Data directory exists');
}

// Check if database exists
const dbPath = path.join(dataDir, 'school.db');
if (!fs.existsSync(dbPath)) {
    console.log('🗄️  Initializing database...');
    try {
        const { initializeDatabase } = require('./utils/database');
        initializeDatabase().then(() => {
            console.log('✅ Database initialized');
            runDataCollection();
        });
    } catch (error) {
        console.log('❌ Failed to initialize database:', error.message);
    }
} else {
    console.log('✅ Database exists');
    runDataCollection();
}

function runDataCollection() {
    console.log('\n🔍 Collecting school data...');
    console.log('   This will scrape the Dovedale Primary School website');
    console.log('   and store the information in the database.\n');
    
    try {
        execSync('node scripts/collect-data.js', { stdio: 'inherit' });
        console.log('\n✅ Data collection completed!');
    } catch (error) {
        console.log('\n⚠️  Data collection had some issues, but the app will still work');
        console.log('   You can run "node scripts/collect-data.js" later to retry');
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit .env and add your Groq API key');
    console.log('2. Run: npm start');
    console.log('3. Visit: http://localhost:3000');
    console.log('\n🌐 To deploy for free:');
    console.log('1. Push to GitHub');
    console.log('2. Connect to Render.com');
    console.log('3. Add GROQ_API_KEY environment variable');
    console.log('4. Deploy!');
} 
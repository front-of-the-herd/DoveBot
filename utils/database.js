const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
const DB_PATH = path.join(dataDir, 'school.db');

let db;

async function initializeDatabase() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('📊 Connected to SQLite database');
      
      // Create tables
      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            source_url TEXT,
            category TEXT,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            checksum TEXT UNIQUE
          )
        `);
        
        db.run(`
          CREATE TABLE IF NOT EXISTS keywords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER,
            keyword TEXT,
            frequency INTEGER DEFAULT 1,
            FOREIGN KEY (document_id) REFERENCES documents(id)
          )
        `);
        
        // Insert some sample data
        insertSampleData();
        resolve();
      });
    });
  });
}

function insertSampleData() {
  const sampleData = [
    {
      title: "School Hours",
      content: "Dovedale Primary School is open from 8:45 AM to 3:15 PM. The school gates open at 8:35 AM. Children should arrive by 8:45 AM for registration.",
      category: "general",
      source_url: "https://www.dovedaleprimary.co.uk"
    },
    {
      title: "School Contact Information", 
      content: "Dovedale Primary School, Dovedale Road, Liverpool L18 1DZ. Phone: 0151 722 3877. Email: admin@dovedaleprimary.co.uk",
      category: "contact",
      source_url: "https://www.dovedaleprimary.co.uk"
    },
    {
      title: "School Uniform",
      content: "School uniform consists of navy blue jumper or cardigan, white polo shirt, grey trousers or skirt, black school shoes. PE kit: white t-shirt, navy shorts, plimsolls.",
      category: "uniform", 
      source_url: "https://www.dovedaleprimary.co.uk"
    }
  ];

  sampleData.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO documents (title, content, category, source_url, checksum) VALUES (?, ?, ?, ?, ?)`,
      [item.title, item.content, item.category, item.source_url, item.title],
      function(err) {
        if (!err && this.changes > 0) {
          // Add keywords
          const keywords = extractKeywords(item.content);
          keywords.forEach(keyword => {
            db.run(
              `INSERT INTO keywords (document_id, keyword) VALUES (?, ?)`,
              [this.lastID, keyword]
            );
          });
        }
      }
    );
  });
}

function extractKeywords(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10);
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
};
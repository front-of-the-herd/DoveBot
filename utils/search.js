const { getDatabase } = require('./database');

async function searchKnowledgeBase(query) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const keywords = extractKeywords(query);
    
    if (keywords.length === 0) {
      resolve([]);
      return;
    }
    
    const keywordPlaceholders = keywords.map(() => '?').join(',');
    const searchQuery = `
      SELECT DISTINCT d.*, 
             COUNT(k.keyword) as relevance_score
      FROM documents d
      JOIN keywords k ON d.id = k.document_id
      WHERE k.keyword IN (${keywordPlaceholders})
      GROUP BY d.id
      ORDER BY relevance_score DESC, d.last_updated DESC
      LIMIT 3
    `;
    
    db.all(searchQuery, keywords, (err, rows) => {
      if (err) {
        console.error('Search error:', err);
        reject(err);
        return;
      }
      
      resolve(rows || []);
    });
  });
}

function extractKeywords(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10);
}

module.exports = {
  searchKnowledgeBase
};
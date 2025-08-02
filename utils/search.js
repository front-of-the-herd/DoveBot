const { getDatabase } = require('./database');

async function searchKnowledgeBase(query) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const keywords = extractKeywords(query);
    
    if (keywords.length === 0) {
      resolve([]);
      return;
    }
    
    // Add semantic synonyms for better matching
    const expandedKeywords = expandKeywords(keywords);
    
    const keywordPlaceholders = expandedKeywords.map(() => '?').join(',');
    const searchQuery = `
      SELECT DISTINCT d.*, 
             COUNT(k.keyword) as relevance_score
      FROM documents d
      JOIN keywords k ON d.id = k.document_id
      WHERE k.keyword IN (${keywordPlaceholders})
      GROUP BY d.id
      ORDER BY relevance_score DESC, d.last_updated DESC
      LIMIT 5
    `;
    
    db.all(searchQuery, expandedKeywords, (err, rows) => {
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

function expandKeywords(keywords) {
  const synonyms = {
    'lunch': ['meals', 'food', 'dinner', 'menu'],
    'dinner': ['meals', 'lunch', 'food', 'menu'],
    'food': ['meals', 'lunch', 'dinner', 'menu'],
    'menu': ['meals', 'lunch', 'food', 'dinner'],
    'uniform': ['clothes', 'dress', 'attire'],
    'clothes': ['uniform', 'dress', 'attire'],
    'term': ['semester', 'period', 'dates'],
    'dates': ['term', 'calendar', 'schedule'],
    'calendar': ['term', 'dates', 'schedule'],
    'clubs': ['activities', 'after', 'school'],
    'activities': ['clubs', 'after', 'school'],
    'contact': ['phone', 'email', 'address', 'number'],
    'phone': ['contact', 'number', 'call'],
    'hours': ['time', 'schedule', 'timing'],
    'time': ['hours', 'schedule', 'timing']
  };
  
  const expanded = [...keywords];
  
  keywords.forEach(keyword => {
    if (synonyms[keyword]) {
      expanded.push(...synonyms[keyword]);
    }
  });
  
  return [...new Set(expanded)]; // Remove duplicates
}

module.exports = {
  searchKnowledgeBase
};
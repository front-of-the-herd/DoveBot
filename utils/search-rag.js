const { VectorDatabase } = require('./vector-db');

class RAGSearch {
    constructor() {
        this.vectorDB = new VectorDatabase();
    }
    
    async searchKnowledgeBase(query) {
        try {
            console.log('🔍 Performing RAG search for:', query);
            
            const results = await this.vectorDB.search(query, 5);
            
            // Convert to expected format
            const formattedResults = results.map((result, index) => ({
                id: index + 1,
                title: result.metadata.title,
                content: result.content,
                category: result.metadata.category,
                source_url: result.metadata.source_url,
                last_updated: new Date().toISOString(),
                checksum: result.metadata.checksum,
                relevance_score: Math.round((1 - result.distance) * 10) // Convert distance to score
            }));
            
            console.log(`📊 Found ${formattedResults.length} relevant documents`);
            return formattedResults;
            
        } catch (error) {
            console.error('❌ RAG search failed:', error.message);
            return [];
        }
    }
}

module.exports = { RAGSearch }; 
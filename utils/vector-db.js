const { ChromaClient } = require('chromadb');
const OpenAI = require('openai');

class VectorDatabase {
    constructor() {
        this.client = new ChromaClient({
            path: "http://localhost:8000" // ChromaDB runs locally
        });
        
        this.openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
            baseURL: process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined
        });
        
        this.collectionName = 'dovebot_knowledge';
        this.initializeCollection();
    }
    
    async initializeCollection() {
        try {
            // Create or get collection
            this.collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
                metadata: {
                    "hnsw:space": "cosine"
                }
            });
            console.log('📊 Connected to ChromaDB vector database');
        } catch (error) {
            console.error('❌ Failed to connect to ChromaDB:', error.message);
            console.log('💡 Make sure ChromaDB is running: pip install chromadb && chroma run --host localhost --port 8000');
        }
    }
    
    async generateEmbedding(text) {
        try {
            // Try OpenAI embedding first
            const response = await this.openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: text
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('❌ OpenAI embedding failed:', error.message);
            
            // Fallback: Use simple TF-IDF style embedding
            console.log('🔄 Using fallback embedding method...');
            return this.generateSimpleEmbedding(text);
        }
    }
    
    generateSimpleEmbedding(text) {
        // Simple word frequency based embedding
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Create a simple vector (normalized word frequencies)
        const uniqueWords = Object.keys(wordFreq);
        const vector = new Array(100).fill(0);
        
        uniqueWords.forEach((word, index) => {
            if (index < 100) {
                vector[index] = wordFreq[word] / words.length;
            }
        });
        
        return vector;
    }
    
    async addDocument(id, content, metadata = {}) {
        try {
            const embedding = await this.generateEmbedding(content);
            if (!embedding) return false;
            
            await this.collection.add({
                ids: [id],
                embeddings: [embedding],
                documents: [content],
                metadatas: [metadata]
            });
            
            console.log(`✅ Added document: ${metadata.title || id}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to add document:', error.message);
            return false;
        }
    }
    
    async search(query, limit = 5) {
        try {
            const queryEmbedding = await this.generateEmbedding(query);
            if (!queryEmbedding) return [];
            
            const results = await this.collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: limit
            });
            
            return results.documents[0].map((doc, index) => ({
                content: doc,
                metadata: results.metadatas[0][index],
                distance: results.distances[0][index]
            }));
        } catch (error) {
            console.error('❌ Search failed:', error.message);
            return [];
        }
    }
    
    async addSchoolData(schoolData) {
        console.log('📚 Adding school data to vector database...');
        
        for (const item of schoolData) {
            const metadata = {
                title: item.title,
                category: item.category,
                source_url: item.source_url,
                checksum: item.checksum
            };
            
            await this.addDocument(item.checksum, item.content, metadata);
        }
        
        console.log('🎉 School data added to vector database!');
    }
}

module.exports = { VectorDatabase }; 
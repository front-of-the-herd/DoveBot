const { ChromaClient } = require('chromadb');
const OpenAI = require('openai');

class VectorDatabase {
    constructor() {
        this.client = new ChromaClient({
            path: "http://localhost:8000" // ChromaDB runs locally
        });
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY,
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
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('❌ Embedding generation failed:', error.message);
            return null;
        }
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
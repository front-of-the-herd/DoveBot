const { ChromaClient, OpenAIEmbeddingFunction } = require('chromadb');

class VectorDatabase {
    constructor() {
        this.client = new ChromaClient();
        this.embeddingFunction = new OpenAIEmbeddingFunction({
            openai_api_key: process.env.GROQ_API_KEY,
            openai_api_base: "https://api.groq.com/v1"
        });
    }

    async addSchoolData(data) {
        try {
            const collection = await this.client.getOrCreateCollection({
                name: "dovedale_knowledge",
                embeddingFunction: this.embeddingFunction
            });

            // Prepare documents for batch adding
            const documents = data.map(item => item.content);
            const metadatas = data.map(item => ({
                title: item.title,
                category: item.category,
                source_url: item.source_url
            }));
            const ids = data.map(item => item.checksum);

            await collection.add({
                ids: ids,
                documents: documents,
                metadatas: metadatas
            });

            return true;
        } catch (error) {
            console.error('Failed to add data:', error);
            throw error;
        }
    }
}

module.exports = { VectorDatabase };
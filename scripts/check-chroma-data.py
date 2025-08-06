from chromadb import Client
import chromadb

def inspect_menu_data():
    # Initialize Chroma client
    client = Client()
    
    # Get the collection
    collection = client.get_collection("dovedale_knowledge")
    
    # Query for menu-related content
    results = collection.query(
        query_texts=["school menu food lunch meals"],
        n_results=10
    )
    
    print(f"\nFound {len(results['documents'][0])} menu-related entries:\n")
    
    # Print each document with its metadata
    for i, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"Entry {i+1}")
        print("=" * 50)
        print(f"Content: {doc}")
        print(f"Metadata: {metadata}")
        print("-" * 50 + "\n")

if __name__ == "__main__":
    inspect_menu_data()
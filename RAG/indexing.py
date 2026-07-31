from langchain_docling.loader import DoclingLoader
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore


def init():
    file_path = "https://arxiv.org/pdf/2408.09869"

    # 1. Load PDF
    loader = DoclingLoader(file_path=file_path)
    documents = loader.load()

    print(f"Loaded {len(documents)} documents")

    # 2. Embedding model
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-large"
    )

    # 3. Create collection + embed + store
    QdrantVectorStore.from_documents(
        documents=documents,
        embedding=embeddings,
        url="http://localhost:6333",
        collection_name="demo_collection",
    )

    print("Indexing of document done")


if __name__ == "__main__":
    init()
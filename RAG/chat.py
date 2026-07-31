
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore

from qdrant_client import QdrantClient

from openai import OpenAI
from dotenv import load_dotenv

import os


load_dotenv()


# OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# Qdrant client
qdrant_client = QdrantClient(
    url="http://localhost:6333"
)


def chat():

    user_query = "What is this document about?"

    # 1. Same embedding model used during indexing
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-large"
    )

    # 2. Connect to existing collection
    vector_store = QdrantVectorStore(
        client=qdrant_client,
        collection_name="demo_collection",
        embedding=embeddings,
    )

    # 3. Create retriever
    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    # 4. Retrieve relevant documents
    relevant_chunks = retriever.invoke(user_query)

    print(f"Retrieved {len(relevant_chunks)} chunks")
    
    
    # 5. Convert Documents → text
    context = "\n\n".join(
        f"""
            Content:
            {doc.page_content}

            Metadata:
            {doc.metadata}
        """
        for doc in relevant_chunks
    )

    # 6. System prompt
    SYSTEM_PROMPT = f"""
        You are an AI assistant who answers questions using context retrieved
        from a PDF document.

        Answer only using the provided context.

        If the answer is not available in the context, say:
        "I could not find this information in the document."

        Context:

        {context}
    """

    # 7. Send context + question to LLM
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_query,
            }
        ]
    )


    rawContent = response.choices[0].message.content
    print(rawContent)
    
if __name__ == "__main__":
    chat()
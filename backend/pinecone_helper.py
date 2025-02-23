from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from dotenv import load_dotenv
from openai import OpenAI
import json
import os

load_dotenv()

openai_key = os.getenv("openai_key")
openai_client = OpenAI(api_key=openai_key)

pinecone_key = os.getenv('pinecone_key')
host = os.getenv('index_host')
pc = Pinecone(api_key=pinecone_key)
index = pc.Index(host=host)

index_name = "helphive"

def update_pinecone(filepath):
    with open(filepath, 'r') as file:
        json_data = json.load(file)
    
    vectors = []
    for item in json_data:
        # data = []
        # for value in item.
    
def pinecone_get_matches(json_data):
    data_arr = []
    
    for interest in json_data.interests:
        data_arr.append(str(interest))
    
    data_string = ", ".join(data)

    try:
        embedding = openai_client.embeddings.create(
            input=data_string,
            model="text-embedding-3-small"
        )
        vector = embedding.data[0].embedding
    except Exception as e:
        return {"error": f"Error embedding vector: {e}"}

    response = index.query(
        namespace="helphive",
        vector=vector,
        top_k=50,
        include_values=True,
        include_metadata=True
    )
    
    return response
    
def pinecone_get_match(id):
    response=index.query(
        namespace="helphive",
        id=id,
        top_k=1,
        include_values=True,
        include_metadata=True
    )
    
    return response.get("matches", [])[0].metadata
    
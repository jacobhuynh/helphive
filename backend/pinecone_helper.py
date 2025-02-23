from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from dotenv import load_dotenv
from openai import OpenAI
import json
import os

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
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
    id_count = 0
    for item in json_data:
        data = []
        if item['causes']:
            for cause in item['causes']:
                data.append(cause)
        if item['skills']:
            for skill in item['skills']:
                data.append(skill)
        if item['goodFor']:
            for group in item['goodFor']:
                data.append(group)
        
        data_string = ", ".join(data)
    
        try:
            response = openai_client.embeddings.create(
                input=data_string,
                model="text-embedding-3-small"
            )
            embedding = response.data[0].embedding
        except Exception as e:
            print(f"Error creating embedding for item {item['id']}")
            continue
        
        vectors.append({
            "id": str(id_count),
            "values": embedding,
            "metadata": {
                "title": item.get("title", "N/A"),
                "organization": item.get("organization", "N/A"),
                "location": item.get("location", "N/A"),
                "description": item.get("description", "N/A"),
                "causes": item.get("causes") or [],
                "goodFor": item.get("goodFor") or [],
                "skills": item.get("skills") or [],
                "missionStatement": item.get("missionStatement", "N/A"),
                "organizationDescription": item.get("organizationDescription", "N/A"),
                "url": item.get("url", "N/A")
            }
        })
        id_count += 1
    
    for i in range(0, len(vectors), 20):
        upsert_resposne = index.upsert(
            vectors=vectors[i:i + 20],
            namespace="helphive"
        )

# only need to run to update
update_pinecone("../scraping/volunteer_opportunities.json")
    
def pinecone_get_matches(json_data):
    data = []
    
    if json_data['causes']:
        for cause in json_data['causes']:
            data.append(cause)
    if json_data['skills']:
        for skill in json_data['skills']:
            data.append(skill)
    if json_data['groups']:
        for group in json_data['groups']:
            data.append(group)
    
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
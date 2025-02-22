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
        # TODO once data gets scraped
    
def get_all_matches():
    # TODO embed user data then match to pinecone db
    
def get_match():
    # TODO get specific volunteer opportunity based on pinecone id
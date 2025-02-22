from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List, Optional
from dotenv import load_dotenv
from mongo_methods import *
from pinecone_methods import *
import os

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class user_data(BaseModel):
    first_name: str
    last_name: str
    email: str
    username: str
    password: str
    location: str
    interests: List[str]
    extra: List[str]
    hours: float
    

def connect_db():
    connection_string = os.getenv('mongo_url')
    client = MongoClient(connection_string)
    db = client['helphive']
    try:
        yield db
    finally:
        client.close()
        
@app.post("/signup/")
def signup(user: user_data, db=depends(connect_db)):
    result = signup(
        db,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        username=user_data.username,
        password=user_data.password,
        location=user_data.location,
        interests=user_data.interests,
        extra=user_data.extra,
        hours=user_data.hours
    )
    return result

@app.get("/get_user/{user_email}")
def get_user(user_email:str, db=Depends(get_db)):
    return get_user(db, user_email)

@app.post("/update_hours/{user_email}")
def get_user(user_email:str, db=Depends(get_db)):
    user = get_user(db, user_email)
    # TODO: figure out logic
    
@app.get("/get_leaderboard/")
def get_leaderboard(db=Depends(get_db)):
    return get_leaderboard(db)

@app.get("/get_matches/{user_email}")
def get_matches(user_email: str, db=Depends(get_db)):
    user = get_user(db, user_email)
    vectors = get_all_matches(user.interests)
    
    matches = [
        {
            'id': match['id']
            'score': match['score']
            'metadata': match.get('metadata', {})
        }
        for match in vectors.get({'matches': matches})
    ]
    
    return jsonable_encoder({'matches':matches})
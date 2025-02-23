from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List, Optional
from dotenv import load_dotenv
from mongo_helper import *
from pinecone_helper import *
import os

# TO START:
# uvicorn server:app --reload

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
    causes: List[str]
    skills: List[str]
    groups: List[str]

def get_db():
    connection_string = os.getenv('mongo_url')
    client = MongoClient(connection_string)
    db = client['helphive']
    try:
        yield db
    finally:
        client.close()
        
@app.post("/signup/")
def signup(user_data: user_data, db=Depends(get_db)):
    result = mongo_signup(
        db,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        username=user_data.username,
        password=user_data.password,
        location=user_data.location,
        causes=user_data.causes,
        skills=user_data.skills,
        groups=user_data.groups
    )
    return result

# Note: need to encode user_email before passing in as parameter
@app.get("/get_user/{user_email}")
def get_user(user_email:str, db=Depends(get_db)):
    return mongo_get_user(db, user_email)

# Usage: {domain}/update_hours/{user_email}?hours={hours}
# Note: need to encode user_email before passing in as parameter
@app.post("/update_hours/{user_email}")
def update_hours(user_email: str, hours: float, db=Depends(get_db)):
    return mongo_update_hours(db, user_email, hours)
    
@app.get("/get_leaderboard/")
def get_leaderboard(db=Depends(get_db)):
    return mongo_get_leaderboard(db)

# Note: need to encode user_email before passing in as parameter
@app.get("/get_matches/{user_email}")
def get_matches(user_email: str, db=Depends(get_db)):
    user = mongo_get_user(db, user_email)
    vectors = pinecone_get_matches(user)
    
    matches = [
        {
            'id': match['id'],
            'score': match['score'],
            'metadata': match.get('metadata', {})
        }
        for match in vectors.get('matches', [])
    ]
    
    return jsonable_encoder({'matches':matches})

# Usage: {domain}/add_volunteering/{user_email}?volunteer_id={pinecone volunteering opportunity id}
# Note: need to encode user_email before passing in as parameter
@app.post("/add_volunteering/{user_email}")
def add_volunteering(user_email: str, volunteer_id: str, db=Depends(get_db)):
    return mongo_add_volunteering(db, user_email, volunteer_id)

@app.get("/get_match/{volunteer_id}")
def get_volunteering(volunteer_id: str):
    return pinecone_get_match(volunteer_id)
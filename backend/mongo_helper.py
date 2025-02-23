import gridfs
from pinecone_helper import *

def mongo_signup(db, first_name, last_name, username, password, email, location, causes, skills, group):
    try:
        fs = gridfs.GridFS(db)
        
        user_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "username": username,
            "password":password,
            "location":location,
            "causes":causes,
            "skills":skills,
            "group":group,
            "hours":0,
            "opportunities":[]
        }
        
        result = db['user_data'].insert_one(user_data)
        return {"message": "Successfully signed user up."}
    except Exception as e:
        return {"error": f"Error signing user up: {str(e)}"}

def mongo_get_user(db, email):
    try:
        result = db['user_data'].find_one({"email":email})
        
        if not result:
            return {"error": "User not found."}
        
        result['_id'] = str(result['_id'])
        return result
    except Exception as e:
        return {"error": f"Error retrieving user: {str(e)}"}
    
def mongo_update_hours(db, email, hours):
    try:
        result = db['user_data'].update_one(
            {"email": email}, 
            {"$inc": {"hours": hours}}
        )
        return {"message": "Hours updated."}
    except Exception as e:
        return {"error": f"Error updating hours: {str(e)}"}

def mongo_get_leaderboard(db):
    try:
        result = list(db['user_data'].find().sort('hours', -1).limit(10))
        
        for user in result:
            user['_id'] = str(user['_id'])
            
        return result
    
    except Exception as e:
        return {"error": f"Error retrieving leaderboard: {str(e)}"}
    
def mongo_add_volunteering(db, email, volunteer_id):
    volunteer_event = pinecone_get_match(volunteer_id)
    volunteer_event['id'] = volunteer_id
    
    try:
        result = db['user_data'].update_one(
            {"email": email}, 
            {"$addToSet": {"opportunities": volunteer_event}}
        )
        return {"message": "Added opportunity successfully."}
    except Exception as e:
        return {"error": f"Error updating opportunities: {str(e)}"}

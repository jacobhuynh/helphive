import gridfs
from pinecone_methods import *

def mongo_signup(db, first_name, last_name, username, password, email, location, interests, extra):
    try:
        fs = gridfs.GridFS(db)
        
        user_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "username": username
            "password":password
            "email":email
            "location":location
            "interests":interests
            "extra":extra
            "hours":hours
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
        return result
    except Exception as e:
        return {"error": f"Error updating hours: {str(e)}"}

def mongo_get_leaderboard(db):
    try:
        result = db['user_data'].find().sort('hours', -1).limit(10)
        return result
    except Exception as e:
        return {"error": f"Error retrieving leaderboard: {str(e)}"}
    
def mongo_add_volunteering(db, email, hours):
    try:

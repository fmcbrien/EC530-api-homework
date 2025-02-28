from fastapi import FastAPI, HTTPException
from typing import List
from models import Device, User, Room, Hallway, Floor, House

app = FastAPI()

# In-memory "database"
devices_db = []

# Get all books
@app.get("/devices", response_model=List[Device])
def get_devices():
    return devices_db

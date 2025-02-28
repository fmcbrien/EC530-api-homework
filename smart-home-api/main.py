from fastapi import FastAPI, HTTPException
from typing import List
from models import Device, User, Room, Hallway, Floor, House

app = FastAPI()

# In-memory "database"
devices_db = []
users_db = []
rooms_db = []
halls_db = []
floors_db = []
houses_db = []

# Get all devices
@app.get("/devices", response_model=List[Device])
def get_devices():
    return devices_db

# Get device by ID
@app.get("/devices/{device_id}", response_model=Device)
def get_device(device_id: int):
    device = next((device for device in devices_db if device.id == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

# Create a new device
@app.post("/devices", response_model=Device)
def create_device(device: Device):
    device.id = len(devices_db) + 1
    devices_db.append(device)
    return device

# Update a device
@app.put("/devices/{device_id}", response_model=Device)
def update_device(device_id: int, updated_device: Device):
    device = next((device for device in devices_db if device.id == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.name = updated_device.name
    device.type = updated_device.type
    device.status = updated_device.status
    device.location = updated_device.location
    device.last_updated = updated_device.last_updated
    device.owner_id = updated_device.owner_id
    device.owner_name = updated_device.owner_name
    return device

# Delete a device
@app.delete("/devices/{device_id}")
def delete_device(device_id: int):
    global devices_db
    devices_db = [device for device in devices_db if device.id != device_id]
    return {"message": "Device deleted successfully"}

# Get all users
@app.get("/users", response_model=List[User])
def get_users():
    return users_db

# Get user by ID
@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    user = next((user for user in users_db if user.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user
@app.post("/users", response_model=User)
def create_user(user: User):
    user.id = len(users_db) + 1
    users_db.append(user)
    return user

# Update a user
@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, updated_user: User):
    user = next((user for user in users_db if user.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.username = updated_user.username
    user.password = updated_user.password
    user.email = updated_user.email
    user.role = updated_user.role
    return user

# Delete a user
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    global users_db
    users_db = [user for user in users_db if user.id != user_id]
    return {"message": "User deleted successfully"}

# Get all rooms
@app.get("/rooms", response_model=List[Room])
def get_rooms():
    return rooms_db

# Get room by ID
@app.get("/rooms/{room_id}", response_model=Room)
def get_room(room_id: int):
    room = next((room for room in rooms_db if room.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

# Create a new room
@app.post("/rooms", response_model=Room)
def create_room(room: Room):
    room.id = len(rooms_db) + 1
    rooms_db.append(room)
    return room

# Update a room
@app.put("/rooms/{room_id}", response_model=Room)
def update_room(room_id: int, updated_room: Room):
    room = next((room for room in rooms_db if room.id == room_id), None)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room.name = updated_room.name
    room.devices = updated_room.devices
    room.owner_id = updated_room.owner_id
    room.owner_name = updated_room.owner_name
    return room

# Delete a room
@app.delete("/rooms/{room_id}")
def delete_room(room_id: int):
    global rooms_db
    rooms_db = [room for room in rooms_db if room.id != room_id]
    return {"message": "Room deleted successfully"}

# Get all hallways
@app.get("/hallways", response_model=List[Hallway])
def get_hallways():
    return halls_db

# Get hallway by ID
@app.get("/hallways/{hallway_id}", response_model=Hallway)
def get_hallway(hallway_id: int):
    hallway = next((hallway for hallway in halls_db if hallway.id == hallway_id), None)
    if not hallway:
        raise HTTPException(status_code=404, detail="Hallway not found")
    return hallway

# Create a new hallway
@app.post("/hallways", response_model=Hallway)
def create_hallway(hallway: Hallway):
    hallway.id = len(halls_db) + 1
    halls_db.append(hallway)
    return hallway

# Update a hallway
@app.put("/hallways/{hallway_id}", response_model=Hallway)
def update_hallway(hallway_id: int, updated_hallway: Hallway):
    hallway = next((hallway for hallway in halls_db if hallway.id == hallway_id), None)
    if not hallway:
        raise HTTPException(status_code=404, detail="Hallway not found")
    hallway.name = updated_hallway.name
    hallway.devices = updated_hallway.devices
    hallway.owner_id = updated_hallway.owner_id
    hallway.owner_name = updated_hallway.owner_name
    return hallway

# Delete a hallway
@app.delete("/hallways/{hallway_id}")
def delete_hallway(hallway_id: int):
    global halls_db
    halls_db = [hallway for hallway in halls_db if hallway.id != hallway_id]
    return {"message": "Hallway deleted successfully"}

# Get all floors
@app.get("/floors", response_model=List[Floor])
def get_floors():
    return floors_db

# Get floor by ID
@app.get("/floors/{floor_id}", response_model=Floor)
def get_floor(floor_id: int):
    floor = next((floor for floor in floors_db if floor.id == floor_id), None)
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    return floor

# Create a new floor
@app.post("/floors", response_model=Floor)
def create_floor(floor: Floor):
    floor.id = len(floors_db) + 1
    floors_db.append(floor)
    return floor

# Update a floor
@app.put("/floors/{floor_id}", response_model=Floor)
def update_floor(floor_id: int, updated_floor: Floor):
    floor = next((floor for floor in floors_db if floor.id == floor_id), None)
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    floor.name = updated_floor.name
    floor.rooms = updated_floor.rooms
    floor.halls = updated_floor.halls
    floor.owner_id = updated_floor.owner_id
    floor.owner_name = updated_floor.owner_name
    return floor

# Delete a floor
@app.delete("/floors/{floor_id}")
def delete_floor(floor_id: int):
    global floors_db
    floors_db = [floor for floor in floors_db if floor.id != floor_id]
    return {"message": "Floor deleted successfully"}

# Get all houses
@app.get("/houses", response_model=List[House])
def get_houses():
    return houses_db

# Get house by ID
@app.get("/houses/{house_id}", response_model=House)
def get_house(house_id: int):
    house = next((house for house in houses_db if house.id == house_id), None)
    if not house:
        raise HTTPException(status_code=404, detail="House not found")
    return house

# Create a new house
@app.post("/houses", response_model=House)
def create_house(house: House):
    house.id = len(houses_db) + 1
    houses_db.append(house)
    return house

# Update a house
@app.put("/houses/{house_id}", response_model=House)
def update_house(house_id: int, updated_house: House):
    house = next((house for house in houses_db if house.id == house_id), None)
    if not house:
        raise HTTPException(status_code=404, detail="House not found")
    house.name = updated_house.name
    house.floors = updated_house.floors
    house.owner_id = updated_house.owner_id
    house.owner_name = updated_house.owner_name
    return house

# Delete a house
@app.delete("/houses/{house_id}")
def delete_house(house_id: int):
    global houses_db
    houses_db = [house for house in houses_db if house.id != house_id]
    return {"message": "House deleted successfully"}

# Run the app with: uvicorn main:app --reload
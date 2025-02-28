from pydantic import BaseModel
from typing import Optional

class Device(BaseModel):
    id: Optional[int] = None
    name: str
    type: str
    status: str
    location: str
    last_updated: Optional[str] = None
    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    data: int

class User(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    email: str
    role: str
    devices: Optional[list[Device]] = None
    
class Room(BaseModel):
    id: Optional[int] = None
    name: str
    devices: Optional[list[Device]] = None
    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    location: str

class Hallway(BaseModel):
    id: Optional[int] = None
    name: str
    devices: Optional[list[Device]] = None
    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    location: str

class Floor(BaseModel):
    id: Optional[int] = None
    name: str
    rooms: Optional[list[Room]] = None
    halls: Optional[list[Hallway]] = None
    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    location: str

class House(BaseModel):
    id: Optional[int] = None
    name: str
    floors: Optional[list[Floor]] = None
    owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    location: str
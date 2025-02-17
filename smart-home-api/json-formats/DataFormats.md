# device-id.json

"device_id": the ID of the specific device (i.e. '1')
"name": the name of the specific device (i.e. 'Hallway thermostat')
"type": the type of the specific device (i.e. 'Thermostat')
"data": the data for the specific device
    "temperature": temperature measurement if the device measures temperature (i.e. '70F')
    "humidity": humidity measurement if the device measures humidity (i.e. '80%')
    "carbon_monoxide": carbon monoxide measurement if the device measures carbon monoxide (i.e. '0')
"assigned_to": which room or hallway the device is assigned to

# floor-id.json

"floor_id": the ID of the specific floor (i.e. '3')
"name": the name of the specific floor (i.e. 'First Floor')
"metadata": any data associated with the floor
"rooms": the IDs of the rooms associated with the floor
"hallways": the IDs of the hallways associated with the floor

# hallway-id.json

"hallway_id": the ID of the specific hallway
"name": the name of the specific hallway
"metadata": any data associated with the specific hallway
"devices": the IDs of the devices associated with the specified hallway

# room-id.json

"room_id": the ID of the specific room
"name": the name of the specified room
"metadata": any data associated with the specified room
"devices": the IDs of the devices associated with the specified room
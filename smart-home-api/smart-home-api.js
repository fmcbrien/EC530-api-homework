const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Databases for demonstration
let houses = [];
let floors = [];
let rooms = [];
let hallways = [];
let devices = {};

// Houses object example
// house = { house_id: '1', name: 'House 1', metadata: {key: 'value'}, floors: [], rooms: [], hallways: []}

// POST: Create a house
app.post('/houses', (req,res) => {
    const { house_id, name, metadata } = req.body;

    if (!house_id || !name) {
        return res.status(400).json({error: 'House ID and Name are required'});
    }

    const newHouse = { house_id, name, metadata, floors: [], rooms: [], hallways: [] };
    houses.push(newHouse);
    res.status(201).json(newHouse);
});

// POST: create a floor in the house
app.post('/floors', (req, res) => {
    const { floor_id, name, house_id, metadata } = req.body;

    if (!floor_id || !name || !house_id) {
        return res.status(400).json({ error: 'Floor ID, Name, and House ID are required' });
    }

    const house = houses.find(h => h.house_id === house_id);
    if (!house){
        return res.status(404).json({ error: 'House not found' });
    }

    const newFloor = {
        floor_id,
        name,
        house_id,
        metadata: metadata || {},
        rooms: [] // because no rooms assigned yet
    }

    floors.push(newFloor);
    house.floors.push(floor_id);

    res.status(201).json(newFloor);
});

// POST: create a hallway in the house
app.post('/hallways', (req, res) => {
    const { hallway_id, name, house_id, floor_id } = req.body;

    if (!hallway_id || !name || !house_id || !floor_id) {
        return res.status(400).json({ error: 'Hallway ID, Name, House ID, and Floor ID are required' });
    }

    const house = houses.find(h => h.house_id === house_id);
    if (!house) {
        return res.status(404).json({ error: 'House not found' });
    }

    const floor = floors.find(f => f.floor_id === floor_id && f.house_id === house_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found in House' });
    }

    const newHallway = {
        hallway_id,
        name,
        house_id,
        floor_id,
        devices: []
    };

    hallways.push(newHallway);
    floor.hallways.push(hallway_id);
    house.hallways.push(hallway_id);

    res.status(201).json(newHallway);
});

// POST: create a room in the house
app.post('/rooms', (req, res) => {
    const { room_id, name, house_id, floor_id } = req.body;

    if (!room_id || !name || !house_id || !floor_id) {
        return res.status(400).json({ error: 'Room ID, Name, House ID, and Floor ID are required' });
    }

    const house = houses.find(h => h.house_id === house_id);
    if (!house) {
        return res.status(404).json({ error: 'House not found' });
    }

    const floor = floors.find(f => f.floor_id === floor_id && f.house_id === house_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found in House' });
    }

    const newRoom = {
        room_id,
        name,
        house_id,
        floor_id,
        devices: []
    };

    rooms.push(newRoom);
    floor.rooms.push(room_id);
    house.rooms.push(room_id);

    res.status(201).json(newRoom);
});

// POST: create a new device in a room or hallway
app.post('/devices', (req, res) => {
    const { device_id, name, type, room_id, hallway_id, status } = req.body;

    if (!device_id || !name || !type || (!room_id && !hallway_id)) {
        return res.status(400).json({ error: 'Device ID, Name, Type, and Room ID or Hallway ID are required. '});
    }

    let targetEntity = null;
    let entityType = '';

    if (room_id) {
        targetEntity = rooms.find(r => r.room_id === room_id);
        entityType = 'room';
    } else if (hallway_id) {
        targetEntity = hallways.find(h => h.hallway_id === hallway_id);
        entityType = 'hallway';
    }

    if (!targetEntity) {
        return res.status(404).json({ error: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found` });
    }

    const newDevice = {
        device_id,
        name,
        type,
        status: status || 'off',
        [entityType + '_id']: room_id || hallway_id
    };

    targetEntity.devices.push(device_id);
    devices[device_id] = newDevice;

    res.status(201).json(newDevice);
});

// PUT: update house
app.put('/houses/:house_id', (req,res) => {
    const house = houses.find(h = h.house_id === req.params.house_id);
    if(!house) {
        return res.status(404).json({ error: 'House not found' });
    }

    // Update metadata
    const { metadata } = req.body;
    house.metadata = { ...house.metadata, ...metadata };
    res.status(200).json(house);
});

// DELETE: deletes chosen house
app.delete('/houses/:house_id', (req, res) => {
    const index = houses.findIndex(h => h.house_id ===req.params.house_id);
    if (index === -1) {
        return res.status(404).json({ error: 'House not found' });
    }
    houses.splice(index, 1);
    res.status(204).end();
});

// PUT: Update a floor's details
app.put('/floors/:floor_id', (req, res) => {
    const { floor_id } = req.params;
    const { name, metadata } = req.body;

    const floor = floors.find(f => f.floor_id === floor_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
    }

    // Update floor information
    if (name) floor.name = name;
    if (metadata) floor.metadata = { ...floor.metadata, ...metadata };

    res.status(200).json(floor);
});

// DELETE: Delete a floor
app.delete('/floors/:floor_id', (req, res) => {
    const { floor_id } = req.params;
    const floorIndex = floors.findIndex(f => f.floor_id === floor_id);
    
    if (floorIndex === -1) {
        return res.status(404).json({ error: 'Floor not found' });
    }

    // Remove the floor from the house
    const floor = floors.splice(floorIndex, 1)[0];
    const house = houses.find(h => h.house_id === floor.house_id);
    if (house) {
        house.floors = house.floors.filter(floor => floor !== floor_id);
    }

    // Optionally, delete rooms and hallways associated with the floor
    rooms = rooms.filter(r => r.floor_id !== floor_id);
    hallways = hallways.filter(h => h.floor_id !== floor_id);

    res.status(200).json({ message: 'Floor deleted successfully' });
});

// PUT: Update a room's details
app.put('/rooms/:room_id', (req, res) => {
    const { room_id } = req.params;
    const { name, metadata } = req.body;

    const room = rooms.find(r => r.room_id === room_id);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    // Update room information
    if (name) room.name = name;
    if (metadata) room.metadata = { ...room.metadata, ...metadata };

    res.status(200).json(room);
});

// DELETE: Delete a room
app.delete('/rooms/:room_id', (req, res) => {
    const { room_id } = req.params;
    const roomIndex = rooms.findIndex(r => r.room_id === room_id);

    if (roomIndex === -1) {
        return res.status(404).json({ error: 'Room not found' });
    }

    // Remove the room from the floor
    const room = rooms.splice(roomIndex, 1)[0];
    const floor = floors.find(f => f.floor_id === room.floor_id);
    if (floor) {
        floor.rooms = floor.rooms.filter(r => r !== room_id);
    }

    // Optionally, remove the device(s) in the room
    devices = Object.values(devices).filter(device => device.room_id !== room_id);

    res.status(200).json({ message: 'Room deleted successfully' });
});

// PUT: Update a hallway's details
app.put('/hallways/:hallway_id', (req, res) => {
    const { hallway_id } = req.params;
    const { name, metadata } = req.body;

    const hallway = hallways.find(h => h.hallway_id === hallway_id);
    if (!hallway) {
        return res.status(404).json({ error: 'Hallway not found' });
    }

    // Update hallway information
    if (name) hallway.name = name;
    if (metadata) hallway.metadata = { ...hallway.metadata, ...metadata };

    res.status(200).json(hallway);
});

// DELETE: Delete a hallway
app.delete('/hallways/:hallway_id', (req, res) => {
    const { hallway_id } = req.params;
    const hallwayIndex = hallways.findIndex(h => h.hallway_id === hallway_id);

    if (hallwayIndex === -1) {
        return res.status(404).json({ error: 'Hallway not found' });
    }

    // Remove the hallway from the floor
    const hallway = hallways.splice(hallwayIndex, 1)[0];
    const floor = floors.find(f => f.floor_id === hallway.floor_id);
    if (floor) {
        floor.hallways = floor.hallways.filter(h => h !== hallway_id);
    }

    // Optionally, remove the device(s) in the hallway
    devices = Object.values(devices).filter(device => device.hallway_id !== hallway_id);

    res.status(200).json({ message: 'Hallway deleted successfully' });
});

// PUT: Update a device's details or reading
app.put('/devices/:device_id', (req, res) => {
    const { device_id } = req.params;
    const { name, status, metadata, reading } = req.body;

    const device = devices[device_id];
    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    // Update device information
    if (name) device.name = name;
    if (status) device.status = status;
    if (metadata) device.metadata = { ...device.metadata, ...metadata };
    if (reading) device.reading = { ...device.reading, ...reading };

    res.status(200).json(device);
});

// DELETE: Delete a device
app.delete('/devices/:device_id', (req, res) => {
    const { device_id } = req.params;

    const device = devices[device_id];
    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    // Remove the device from the room or hallway
    if (device.room_id) {
        const room = rooms.find(r => r.room_id === device.room_id);
        if (room) {
            room.devices = room.devices.filter(d => d !== device_id);
        }
    }
    if (device.hallway_id) {
        const hallway = hallways.find(h => h.hallway_id === device.hallway_id);
        if (hallway) {
            hallway.devices = hallway.devices.filter(d => d !== device_id);
        }
    }

    // Delete the device from the devices collection
    delete devices[device_id];

    res.status(200).json({ message: 'Device deleted successfully' });
});

// GET: Retrieve a specific house by its ID
app.get('/houses/:house_id', (req, res) => {
    const { house_id } = req.params;

    // Find the house from the house list by its ID
    const house = houses.find(h => h.house_id === house_id);
    
    // If the house is not found, return a 404 error
    if (!house) {
        return res.status(404).json({ error: 'House not found' });
    }

    // Retrieve all floors associated with this house
    const houseFloors = house.floors.map(floor_id => {
        return floors.find(floor => floor.floor_id === floor_id);
    });

    // Include rooms and hallways for each floor
    houseFloors.forEach(floor => {
        floor.rooms = floor.rooms.map(room_id => {
            return rooms.find(room => room.room_id === room_id);
        });

        floor.hallways = floor.hallways.map(hallway_id => {
            return hallways.find(hallway => hallway.hallway_id === hallway_id);
        });
    });

    // Add metadata or any other house-specific data to the response
    const houseDetails = {
        house_id: house.house_id,
        name: house.name,
        metadata: house.metadata,
        floors: houseFloors
    };

    // Respond with the full house details
    res.status(200).json(houseDetails);
});

// GET: Retrieve all floors in a house
app.get('/houses/:house_id/floors', (req, res) => {
    const { house_id } = req.params;

    const house = houses.find(h => h.house_id === house_id);
    if (!house) {
        return res.status(404).json({ error: 'House not found' });
    }

    // Return all floors associated with the house
    const houseFloors = house.floors.map(floor_id => {
        return floors.find(floor => floor.floor_id === floor_id);
    });

    res.status(200).json(houseFloors);
});

// GET: Retrieve a specific floor by its ID
app.get('/floors/:floor_id', (req, res) => {
    const { floor_id } = req.params;

    const floor = floors.find(f => f.floor_id === floor_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
    }

    res.status(200).json(floor);
});

// GET: Retrieve all rooms for a specific floor
app.get('/floors/:floor_id/rooms', (req, res) => {
    const { floor_id } = req.params;

    const floor = floors.find(f => f.floor_id === floor_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
    }

    // Retrieve all rooms associated with this floor
    const floorRooms = floor.rooms.map(room_id => {
        return rooms.find(room => room.room_id === room_id);
    });

    res.status(200).json(floorRooms);
});

// GET: Retrieve a specific room by its ID
app.get('/rooms/:room_id', (req, res) => {
    const { room_id } = req.params;

    const room = rooms.find(r => r.room_id === room_id);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
});

// GET: Retrieve all hallways for a specific floor
app.get('/floors/:floor_id/hallways', (req, res) => {
    const { floor_id } = req.params;

    const floor = floors.find(f => f.floor_id === floor_id);
    if (!floor) {
        return res.status(404).json({ error: 'Floor not found' });
    }

    // Retrieve all hallways associated with this floor
    const floorHallways = floor.hallways.map(hallway_id => {
        return hallways.find(hallway => hallway.hallway_id === hallway_id);
    });

    res.status(200).json(floorHallways);
});

// GET: Retrieve a specific hallway by its ID
app.get('/hallways/:hallway_id', (req, res) => {
    const { hallway_id } = req.params;

    const hallway = hallways.find(h => h.hallway_id === hallway_id);
    if (!hallway) {
        return res.status(404).json({ error: 'Hallway not found' });
    }

    res.status(200).json(hallway);
});

// GET: Retrieve all devices for a specific room
app.get('/rooms/:room_id/devices', (req, res) => {
    const { room_id } = req.params;

    const room = rooms.find(r => r.room_id === room_id);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    // Filter devices in the room
    const devicesInRoom = Object.values(devices).filter(device => device.room_id === room_id);

    res.status(200).json(devicesInRoom);
});

// GET: Retrieve all devices for a specific hallway
app.get('/hallways/:hallway_id/devices', (req, res) => {
    const { hallway_id } = req.params;

    const hallway = hallways.find(h => h.hallway_id === hallway_id);
    if (!hallway) {
        return res.status(404).json({ error: 'Hallway not found' });
    }

    // Filter devices in the hallway
    const devicesInHallway = Object.values(devices).filter(device => device.hallway_id === hallway_id);

    res.status(200).json(devicesInHallway);
});

// GET: Retrieve a specific device by its ID
app.get('/devices/:device_id', (req, res) => {
    const { device_id } = req.params;

    const device = devices[device_id];
    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    res.status(200).json(device);
});

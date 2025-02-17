const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let houses = [];
let messages = {};

// POST: Create a new user
app.post('/users', (req, res) => {
    const { username, email } = req.body;

    // Basic validation: check if username and email are provided
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Create a new user
    const newUser = {
        user_id: `user${users.length + 1}`,
        username,
        email,
        messages: [],
        contacts: []
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// POST: Send a message from one user to others
app.post('/messages', (req, res) => {
    const { sender_id, recipient_ids, message } = req.body;

    // Basic validation
    if (!sender_id || !recipient_ids || !message) {
        return res.status(400).json({ error: 'Sender ID, recipient IDs, and message are required' });
    }

    // Check if sender exists
    const sender = users.find(u => u.user_id === sender_id);
    if (!sender) {
        return res.status(404).json({ error: 'Sender not found' });
    }

    // Check if recipients exist
    const recipients = recipient_ids.map(id => users.find(u => u.user_id === id));
    if (recipients.includes(undefined)) {
        return res.status(404).json({ error: 'One or more recipients not found' });
    }

    // Create a new message
    const newMessage = {
        message_id: `msg${messages.length + 1}`,
        sender_id,
        recipients: recipient_ids,
        message,
        timestamp: new Date().toISOString()
    };

    // Save the message to each recipient's inbox and the sender's sent messages
    recipients.forEach(recipient => recipient.messages.push(newMessage));
    sender.messages.push(newMessage);

    // Respond with the sent message
    res.status(201).json(newMessage);
});

// POST: Send a notification to the recipient after receiving a message
app.post('/notifications', (req, res) => {
    const { recipient_id, message } = req.body;

    // Basic validation
    if (!recipient_id || !message) {
        return res.status(400).json({ error: 'Recipient ID and message are required' });
    }

    // Check if the recipient exists
    const recipient = users.find(u => u.user_id === recipient_id);
    if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
    }

    // Create a notification
    const notification = {
        notification_id: `notif${notifications.length + 1}`,
        recipient_id,
        message,
        timestamp: new Date().toISOString()
    };

    notifications.push(notification);

    // Notify the user (in practice, this could trigger a push notification or an email)
    console.log(`Notification sent to ${recipient.username}: ${message}`);

    res.status(201).json(notification);
});

// PUT: Update a specific message by its ID
app.put('/messages/:message_id', (req, res) => {
    const { message_id } = req.params;
    const { status } = req.body;

    // Check if status is valid
    if (status && !['read', 'unread'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find the message
    const message = messages.find(m => m.message_id === message_id);
    if (!message) {
        return res.status(404).json({ error: 'Message not found' });
    }

    // Update the message's status
    message.status = status || message.status;

    res.status(200).json(message);
});

// DELETE: Delete a specific message by its ID
app.delete('/messages/:message_id', (req, res) => {
    const { message_id } = req.params;

    // Find and delete the message
    const messageIndex = messages.findIndex(m => m.message_id === message_id);
    if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
    }

    // Remove the message from all user inboxes and sent messages
    messages.splice(messageIndex, 1);

    res.status(204).json();
});

// DELETE: Delete a user by their ID
app.delete('/users/:user_id', (req, res) => {
    const { user_id } = req.params;

    // Find the user by ID
    const userIndex = users.findIndex(u => u.user_id === user_id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove the user from the list of users
    const deletedUser = users.splice(userIndex, 1)[0];

    // Remove any references to this user from other users' contact lists
    users.forEach(user => {
        user.contacts = user.contacts.filter(contact_id => contact_id !== user_id);
        // Remove the deleted user's messages from other users' inboxes
        user.messages = user.messages.filter(message => {
            return !message.recipients.includes(user_id) && message.sender_id !== user_id;
        });
    });

    // Remove any sent messages by the deleted user
    messages = messages.filter(message => {
        return !message.recipients.includes(user_id) && message.sender_id !== user_id;
    });

    // Respond with a success message
    res.status(200).json({ message: `User ${deletedUser.username} has been deleted successfully` });
});

// GET: Retrieve a specific user by their ID
app.get('/users/:user_id', (req, res) => {
    const { user_id } = req.params;

    const user = users.find(u => u.user_id === user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
});

// GET: Search for users by username
app.get('/users/search', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username query parameter is required' });
    }

    const searchResults = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));

    res.status(200).json(searchResults);
});

// GET: Retrieve all messages for a specific user
app.get('/messages/:user_id', (req, res) => {
    const { user_id } = req.params;

    const user = users.find(u => u.user_id === user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve all messages for the user
    res.status(200).json(user.messages);
});


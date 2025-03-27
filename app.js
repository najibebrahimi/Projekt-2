// Install dependencies by running: npm install express

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data (application/x-www-form-urlencoded or JSON)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a simple route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log(`Received a new contact form submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);

    // Example: Send an email, store in a database, or log to a file here.

    // Send a success response
    res.status(200).json({ message: 'Form submitted successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Required modules
const express = require('express');
const mysql = require('mysql2'); // Use mysql2 for modern MySQL support

// Create an Express application
const app = express();
const port = 3000;

// MySQL database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'your_database' // Replace with your database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(express.json()); // To parse JSON bodies

// Example route to fetch recipes
app.get('/recipes', (req, res) => {
    connection.query('SELECT * FROM recipes', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching recipes');
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
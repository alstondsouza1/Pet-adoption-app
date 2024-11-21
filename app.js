const mariadb = require('mariadb');

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to handle form data
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Database connection
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_new_password',
    database: 'pets',
    connectionLimit: 5
});

// Helper function to connect to the database
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}
// Default route to render the adoption form
app.get('/', (req, res) => {
    res.render('home');
});

// Route to handle the form submission and display the confirmation
app.post('/confirm', async (req, res) => {
    const data = req.body;

    // Pluralize pet type if quantity > 1
    if (data.quantity > 1) {
        data.pet_type += 's';
    }

    // Write to the database
    const conn = await connect();
    await conn.query(
        'INSERT INTO adoptions (pet_type, quantity, color) VALUES (?, ?, ?)',
        [data.pet_type, data.quantity, data.color]
    );
    conn.release();

    res.render('confirmation', { details: data });
    
});

// Route to display all adoptions
app.get('/adoptions', async (req, res) => {
    
    const conn = await connect();
    const results = await conn.query
        ('SELECT * FROM adoptions ORDER BY data_submitted DESC');
    res.render('adoptions', { adoptions: results });    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

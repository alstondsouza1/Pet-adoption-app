const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to handle form data
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Default route to render the adoption form
app.get('/', (req, res) => {
    res.render('home');
});

// Route to handle the form submission and display the confirmation
app.post('/confirm', (req, res) => {
    const data = req.body;

    // Pluralize pet type if quantity > 1
    if (data.quantity > 1) {
        data.pet_type += 's';
    }

    res.render('confirmation', { details: data });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

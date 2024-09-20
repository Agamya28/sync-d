const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // User model file
const router = express.Router();

// POST /auth/signup route
router.post('/', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user to the database
        await newUser.save();

        // Redirect to login after successful signup
        res.redirect('/login.html');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error. Please try again later.');
    }
});

module.exports = router;


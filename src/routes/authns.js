const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const path = require('path')

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const student_name = req.body['name']
        const matric_no = req.body['matric-no']

        let user = await User.findOne({ matric_no })
        if (user) return res.status(400).json({ error: 'Student already exists' })

        // Get fingerprint data
        // const hashedPassword = await bcrypt.hash(password, 10)

        // user = new User({ matric_no, matric_no, password: hashedPassword })
        user = new User({ student_name, matric_no })
        await user.save()

        res.status(201).json({ message: 'Student registered successfully' })
    } catch (err) {
        console.log('signup error: ', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)

        const user = await User.findOne({ username })
        console.log(user, ' user')
        if (!user) return res.status(400).json({ error: 'Student doesn\'t exist' })


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' })


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ message: 'Login successful', token })
    } catch (err) {
        console.log('login error: ', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'skilnexia_prod_secret_unique_2026', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student', // Default role
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Normalize email
        const normalizedEmail = (email || '').toLowerCase().trim();
        console.log(`[LOGIN] Attempting login for: ${normalizedEmail}`);

        // Check for user email
        const user = await User.findOne({ email: normalizedEmail });
        console.log(`[LOGIN] User found: ${!!user}`);

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`[LOGIN] Success for: ${normalizedEmail}`);
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log(`[LOGIN] Failed for: ${normalizedEmail} — user: ${!!user}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('[LOGIN] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Setup initial test accounts (Admin, HR, Trainer)
// @route   GET /api/auth/setup-accounts
// @access  Public (Secure initialization - only works if 0 users exist)
const setupAccounts = async (req, res) => {
    try {
        // Security guard: Only runs if database has no existing users
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(403).json({
                success: false,
                message: 'System already initialized. Setup is locked.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Skilnexia@123', salt);

        const accounts = [
            { email: 'admin@skilnexia.com', name: 'Super Admin', role: 'admin' },
            { email: 'hr@skilnexia.com', name: 'Human Resource', role: 'hr' },
            { email: 'trainer@skilnexia.com', name: 'Master Trainer', role: 'trainer' }
        ];

        const results = [];
        for (const acc of accounts) {
            const result = await User.findOneAndUpdate(
                { email: acc.email },
                { ...acc, password: hashedPassword },
                { upsert: true, new: true }
            );
            results.push({ email: result.email, role: result.role, status: 'created/updated' });
        }

        res.status(200).json({ 
            success: true,
            message: 'Ecosystem test accounts initialized successfully.',
            initializedAccounts: results
        });
    } catch (error) {
        console.error('Core Bootstrap Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Critical error during system bootstrap.',
            error: error.message 
        });
    }
};


// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    setupAccounts,
};

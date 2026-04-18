const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Shared email transporter
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendRegistrationEmail = async (toEmail, studentName, rawPassword) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[Email] EMAIL_USER or EMAIL_PASS not set. Skipping registration email.');
        return;
    }
    try {
        const transporter = createTransporter();
        const loginUrl = process.env.FRONTEND_URL || 'https://skilnexia.com/login';
        await transporter.sendMail({
            from: `"SkilNexia" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Welcome to SkilNexia! 🚀 Your Account is Ready`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f8fafc; padding:40px 0;">
                    <div style="max-width:600px; margin:0 auto; background:white; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <div style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:40px; text-align:center;">
                            <h1 style="color:white; margin:0; font-size:28px; font-weight:900; letter-spacing:-0.5px;">Welcome to SkilNexia!</h1>
                        </div>
                        <div style="padding:40px;">
                            <p style="color:#334155; font-size:16px; line-height:1.6;">Hi <strong>${studentName}</strong>,</p>
                            <p style="color:#334155; font-size:16px; line-height:1.6;">Your premium learning account has been successfully created. You can now access all your enrolled courses, both free and paid, from your dashboard.</p>
                            <div style="background:#f1f5f9; border-radius:16px; padding:24px; margin:24px 0;">
                                <p style="color:#64748b; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin:0 0 8px;">Your Credentials</p>
                                <p style="color:#1e293b; font-size:16px; margin:4px 0;"><strong>Email:</strong> ${toEmail}</p>
                                <p style="color:#1e293b; font-size:16px; margin:4px 0;"><strong>Password:</strong> ${rawPassword}</p>
                            </div>
                            <div style="text-align:center; margin-top:32px;">
                                <a href="${loginUrl}" style="background:#2563eb; color:white; padding:14px 32px; text-decoration:none; border-radius:12px; font-weight:bold; font-size:16px; display:inline-block;">Login to Dashboard</a>
                            </div>
                            <p style="color:#94a3b8; font-size:12px; margin-top:40px; text-align:center;">— The SkilNexia Team</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[Email] Registration email sent to ${toEmail}`);
    } catch (err) {
        console.error('[Email] Failed to send registration email:', err.message);
    }
};

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
            platform: 'skilnexia'
        });

        if (user) {
            // Send registration email
            await sendRegistrationEmail(email, name, password);

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

        // Check for user email (Allow legacy users without platform field during transition)
        const user = await User.findOne({ 
            email: normalizedEmail, 
            $or: [{ platform: 'skilnexia' }, { platform: { $exists: false } }] 
        });
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
                { email: acc.email, platform: 'skilnexia' },
                { ...acc, password: hashedPassword, platform: 'skilnexia' },
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

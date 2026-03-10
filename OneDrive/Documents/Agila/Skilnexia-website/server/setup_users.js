const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const setupUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia');
        console.log('Connected to DB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Skilnexia@123', salt);

        // Reset Trainer
        await User.findOneAndUpdate(
            { email: 'vaideeswari@gmail.com' },
            { password: hashedPassword },
            { upsert: true, new: true }
        );
        console.log('Trainer (vaideeswari@gmail.com) password reset to Skilnexia@123');

        // Reset Admin
        await User.findOneAndUpdate(
            { email: 'admin@skilnexia.com' },
            { password: hashedPassword, role: 'admin' },
            { upsert: true, new: true }
        );
        console.log('Admin (admin@skilnexia.com) password reset to Skilnexia@123');

        // Create HR if not exists
        await User.findOneAndUpdate(
            { email: 'hr@skilnexia.com' },
            { name: 'Skilnexia HR', role: 'hr', password: hashedPassword },
            { upsert: true, new: true }
        );
        console.log('HR (hr@skilnexia.com) created/reset with password Skilnexia@123');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

setupUsers();

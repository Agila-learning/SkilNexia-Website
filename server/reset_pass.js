const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia');
        console.log('Connected to DB');

        const email = 'agila@gmail.com';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Skilnexia@123', salt);

        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log('Password reset successfully for:', email);
        } else {
            console.log('User not found:', email);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

resetPassword();

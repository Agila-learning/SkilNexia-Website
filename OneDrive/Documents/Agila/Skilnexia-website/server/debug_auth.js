const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Lead = require('./models/Lead');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia');
        console.log('Connected to DB');

        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(u => {
            console.log(`- "${u.email}" (${u.role}) id: ${u._id}`);
        });

        const email = 'agila@gmail.com';
        const user = await User.findOne({ email });
        if (user) {
            console.log('Target User Found:', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        } else {
            console.log('Target User Not Found');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUser();

require('dotenv').config();
const mongoose = require('mongoose');

const checkConnection = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia';
        console.log(`Connecting to: ${uri.split('@')[1] || uri}`);
        await mongoose.connect(uri);
        console.log('SUCCESS: MongoDB Connected');
        process.exit(0);
    } catch (err) {
        console.error(`FAILURE: ${err.message}`);
        process.exit(1);
    }
};

checkConnection();

const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const fixWeb3Data = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const web3Course = await Course.findOne({ category: 'Web3' });
        if (web3Course) {
            web3Course.title = "Web3 & Blockchain Mastery";
            web3Course.banner = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200";
            web3Course.syllabus = [
                { step: "Phase 1: Blockchain Fundamentals", desc: "Cryptography, Hashing, and P2P Network architecture." },
                { step: "Phase 2: Ethereum & Solidity", desc: "Smart contract development and EVM internals." },
                { step: "Phase 3: DApp Architecture", desc: "Building decentralized frontends with Ethers.js and Web3.js." },
                { step: "Phase 4: DeFi & Advanced Protocols", desc: "Yield farming, L2 scaling solutions, and NFT standards." }
            ];
            await web3Course.save();
            console.log('Web3 Course data updated successfully');
        } else {
            console.log('Web3 Course not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error updating Web3 course:', error);
        process.exit(1);
    }
};

fixWeb3Data();

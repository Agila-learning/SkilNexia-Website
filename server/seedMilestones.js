require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const seedMilestones = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia');
        console.log('MongoDB Connected.');

        const courses = await Course.find({});
        
        for (const course of courses) {
            // Add sample milestones
            course.milestones = [
                {
                    moduleIndex: 1,
                    badgeTitle: "Fast Starter",
                    badgeIcon: "Zap",
                    description: "Completed the first module with lightning speed!"
                },
                {
                    moduleIndex: 3,
                    badgeTitle: "Architect",
                    badgeIcon: "Layout",
                    description: "Mastered core architectural principles."
                }
            ];
            
            // Set first course as 'free' for testing
            if (course.title.includes('Full Stack Engine')) {
                course.courseType = 'paid';
            } else {
                course.courseType = 'free';
            }
            
            await course.save();
            console.log(`Updated milestones for: ${course.title}`);
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedMilestones();

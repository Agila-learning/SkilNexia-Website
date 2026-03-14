require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course'); // Adjust path if needed depending on where this script is placed

const coursesData = [
    {
        title: "Premium Full Stack Engine",
        description: "Master the complete MERN stack with enterprise-grade architecture. Build scalable applications from scratch and deploy them globally.",
        category: "Full Stack Web Dev",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
        price: 499,
        level: "intermediate",
        duration: "24 Weeks",
        certificationInfo: "Skilnexia Certified Full Stack Architect",
        placementSupport: "100% Guaranteed Interviews with 50+ Tech Partners.",
        toolsCovered: ["React", "Node.js", "Express", "MongoDB", "Redux", "Docker", "AWS"],
        projects: [
            { title: "E-Commerce Microservices", description: "A highly scalable distributed commerce engine." },
            { title: "Real-time Chat Overlay", description: "Socket.io based real-time messaging layer." }
        ],
        modules: [
            { title: "Frontend Architecture", content: "React 18 internals, Server Components, and State Management.", duration: "6 Weeks" },
            { title: "Backend Systems", content: "Node.js optimization, Express routing, and security policies.", duration: "8 Weeks" },
            { title: "Database & DevOps", content: "Advanced MongoDB indexing, Docker containers, and CI/CD.", duration: "10 Weeks" }
        ],
        faqs: [
            { question: "Do I need basic JS knowledge?", answer: "Yes, basic JS knowledge is recommended before starting." },
            { question: "Are projects hands-on?", answer: "Absolutely. 80% of the curriculum is project-based." }
        ],
        isPublished: true
    },
    {
        title: "AI & Data Science Masterclass",
        description: "Unlock the power of Machine Learning and Data Analytics. Learn Python, Neural Networks, and deploy LLM applications.",
        category: "Data Science & AI",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200",
        price: 599,
        level: "advanced",
        duration: "30 Weeks",
        certificationInfo: "Skilnexia Certified Data Scientist",
        placementSupport: "Dedicated mentorship for top tier product companies.",
        toolsCovered: ["Python", "TensorFlow", "PyTorch", "Pandas", "Hugging Face"],
        projects: [
            { title: "Generative AI Chatbot", description: "Build a custom LLM leveraging Langchain." },
            { title: "Predictive Market Analysis", description: "Time-series forecasting for retail data." }
        ],
        modules: [
            { title: "Applied Mathematics", content: "Linear Algebra and Calculus for Machine Learning.", duration: "4 Weeks" },
            { title: "Core Machine Learning", content: "Supervised and Unsupervised Learning techniques.", duration: "10 Weeks" },
            { title: "Deep Learning & NLP", content: "Neural Networks, CNNs, RNNs, and Transformers.", duration: "16 Weeks" }
        ],
        faqs: [
            { question: "Is this for beginners?", answer: "We recommend some prior programming experience." }
        ],
        isPublished: true
    },
    {
        title: "Advanced Cloud Architecture",
        description: "Design and implement highly available and resilient systems on AWS and Azure.",
        category: "Cloud Architecture",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        price: 450,
        level: "advanced",
        duration: "20 Weeks",
        certificationInfo: "Skilnexia Certified Cloud Architect",
        placementSupport: "Interview prep for Architect roles.",
        toolsCovered: ["AWS", "Azure", "Terraform", "Kubernetes"],
        projects: [
            { title: "Multi-Region Serverless App", description: "Deploy a global application using serverless technologies." }
        ],
        modules: [
            { title: "Cloud Fundamentals", content: "Networking, IAM, and Compute basics.", duration: "4 Weeks" },
            { title: "Infrastructure as Code", content: "Mastering Terraform and CD/CI.", duration: "8 Weeks" }
        ],
        faqs: [
            { question: "Do I need AWS experience?", answer: "Basic cloud understanding is helpful." }
        ],
        isPublished: true
    },
    {
        title: "Cyber Security Fundamentals",
        description: "Protect enterprise networks and master ethical hacking techniques. From penetration testing to cryptography.",
        category: "Cyber Security",
        thumbnail: "https://images.unsplash.com/photo-1510511459019-5efa3ac9eabc?q=80&w=1200&auto=format&fit=crop",
        price: 399,
        level: "beginner",
        duration: "16 Weeks",
        certificationInfo: "Skilnexia Certified Security Expert",
        placementSupport: "Dedicated cyber security job board access.",
        toolsCovered: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite"],
        projects: [
            { title: "Vulnerability Assessment", description: "Audit a mock enterprise network." }
        ],
        modules: [
            { title: "Network Security", content: "Firewalls, VPNs, and Intrusion Detection.", duration: "6 Weeks" },
            { title: "Application Security", content: "OWASP Top 10 and secure coding.", duration: "10 Weeks" }
        ],
        faqs: [
            { question: "Is math programming required?", answer: "No, focuses more on networking concepts." }
        ],
        isPublished: true
    },
    {
        title: "Digital Design Strategy (UI/UX)",
        description: "Master user psychology, interaction design, and high-fidelity prototyping using modern tools.",
        category: "UI/UX Design",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
        price: 350,
        level: "beginner",
        duration: "14 Weeks",
        certificationInfo: "Skilnexia Certified Product Designer",
        placementSupport: "Portfolio building and mock interviews.",
        toolsCovered: ["Figma", "Adobe XD", "Framer", "Miro"],
        projects: [
            { title: "Fintech App Redesign", description: "End-to-end design of a mobile banking app." }
        ],
        modules: [
            { title: "Design Thinking", content: "User research, personas, and wireframing.", duration: "4 Weeks" },
            { title: "Visual Design", content: "Typography, color theory, and prototyping.", duration: "10 Weeks" }
        ],
        faqs: [
            { question: "Do I need drawing skills?", answer: "No, UI/UX is about user flow and problem solving." }
        ],
        isPublished: true
    },
    {
        title: "DevOps Engineering Bootcamp",
        description: "Automate everything. Master the pipelines that run modern software teams smoothly and securely.",
        category: "DevOps",
        thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
        price: 550,
        level: "intermediate",
        duration: "24 Weeks",
        certificationInfo: "Skilnexia Certified DevOps Engineer",
        placementSupport: "Guaranteed interviews for high performers.",
        toolsCovered: ["Docker", "Kubernetes", "Jenkins", "Ansible", "GitLab CI"],
        projects: [
            { title: "Automated Deployment Pipeline", description: "Zero-downtime deployment setup." }
        ],
        modules: [
            { title: "Containerization", content: "Docker internals and Compose.", duration: "6 Weeks" },
            { title: "Orchestration & CI/CD", content: "Kubernetes clusters and Jenkins pipelines.", duration: "18 Weeks" }
        ],
        faqs: [
            { question: "What are the prerequisites?", answer: "Basic Linux and scripting knowledge." }
        ],
        isPublished: true
    },
    {
        title: "Mobile App Development with React Native",
        description: "Build cross-platform iOS and Android applications from a single codebase.",
        category: "Mobile Development",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
        price: 420,
        level: "intermediate",
        duration: "18 Weeks",
        certificationInfo: "Skilnexia Certified Mobile Dev",
        placementSupport: "Direct referrals to mobile-first startups.",
        toolsCovered: ["React Native", "Expo", "Redux", "Firebase"],
        projects: [
            { title: "Social Media Clone", description: "Real-time feed, chat, and notifications." }
        ],
        modules: [
            { title: "React Native Basics", content: "Views, text, styling, and navigation.", duration: "6 Weeks" },
            { title: "Advanced Mobile APIs", content: "Camera, geolocation, and push notifications.", duration: "12 Weeks" }
        ],
        faqs: [
            { question: "Do I need a Mac?", answer: "Helpful for iOS testing, but Expo works anywhere." }
        ],
        isPublished: true
    },
    {
        title: "Enterprise Blockchain Solutions",
        description: "Understand smart contracts, decentralized apps, and ledger technologies for future finance.",
        category: "Web3 & Blockchain",
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=1200&auto=format&fit=crop",
        price: 650,
        level: "advanced",
        duration: "20 Weeks",
        certificationInfo: "Skilnexia Certified Web3 Engineer",
        placementSupport: "Mentorship by industry leaders.",
        toolsCovered: ["Solidity", "Ethereum", "Hardhat", "Web3.js"],
        projects: [
            { title: "DeFi Staking DApp", description: "Build a decentralized token staking application." }
        ],
        modules: [
            { title: "Blockchain Fundamentals", content: "Cryptography and consensus mechanisms.", duration: "4 Weeks" },
            { title: "Smart Contract Development", content: "Writing and testing Solidity contracts securely.", duration: "16 Weeks" }
        ],
        faqs: [
            { question: "What programming language should I know?", answer: "JavaScript is essential, C++ or Rust is a plus." }
        ],
        isPublished: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilnexia');
        console.log('MongoDB Connected.');

        // Clear existing to avoid duplicates during testing
        await Course.deleteMany({});
        console.log('Existing courses cleared.');

        const insertedCourses = await Course.insertMany(coursesData);
        console.log(`Successfully seeded ${insertedCourses.length} courses!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();

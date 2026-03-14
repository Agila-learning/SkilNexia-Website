import {
    Code, Database, Globe, Smartphone, Shield, BarChart, Cpu,
    Layers, Layout, Server, Terminal, Lock, Cloud, Bot,
    Search, Rocket, Target, Users, Award, Briefcase, Zap,
    PenTool, Lightbulb, TrendingUp, Activity, Monitor,
    HardDrive, Settings, LineChart, Brain, Network
} from 'lucide-react';

export const COURSE_CATEGORIES = [
    {
        id: "mern-001",
        category: "Development",
        title: "MERN Stack Masterclass",
        icon: <Layers size={24} />,
        banner: "/images/hero_full_stack_web_1772198298591.png",
        duration: "6 Months",
        syllabus: [
            { step: "Phase 1: React & Redux", desc: "Build dynamic frontends with React, Hooks, and Redux Toolkit.", icon: <Layout />, image: "/images/hero_full_stack_web_1772198298591.png" },
            { step: "Phase 2: Node & Express", desc: "Develop robust, scalable backend APIs.", icon: <Server />, image: "/images/hero_full_stack_web_1772198298591.png" },
            { step: "Phase 3: MongoDB Mastery", desc: "Database design, aggregation pipelines, and Mongoose.", icon: <Database />, image: "/images/hero_full_stack_web_1772198298591.png" },
            { step: "Phase 4: Full Stack Enterprise App", desc: "Deploy a complete multi-tier architecture to AWS.", icon: <Rocket />, image: "/images/hero_full_stack_web_1772198298591.png" }
        ]
    },
    {
        id: "java-001",
        category: "Development",
        title: "Java Full Stack",
        icon: <Code size={24} />,
        banner: "/images/hero_java_programming_1772198361881.png",
        duration: "6 Months",
        syllabus: [
            { step: "Phase 1: Core Java", desc: "OOPs concepts, Streams, and Multithreading.", icon: <Terminal />, image: "/images/hero_java_programming_1772198361881.png" },
            { step: "Phase 2: Spring Boot & Hibernate", desc: "Microservices architecture and ORM integration.", icon: <Server />, image: "/images/hero_java_programming_1772198361881.png" },
            { step: "Phase 3: React Frontend", desc: "Connecting enterprise backend with modern frontend.", icon: <Layout />, image: "/images/thumbnail_react_course_1772179313562.png" }
        ]
    },
    {
        id: "python-001",
        category: "Development",
        title: "Python Pro",
        icon: <Terminal size={24} />,
        banner: "/images/hero_python_programming_1772198345885.png",
        duration: "4 Months",
        syllabus: [
            { step: "Phase 1: Python Fundamentals", desc: "Data structures, algorithms, and logic building.", icon: <Code />, image: "/images/hero_python_programming_1772198345885.png" },
            { step: "Phase 2: Django & Fast API", desc: "Develop secure and fast web APIs.", icon: <Server />, image: "/images/hero_python_programming_1772198345885.png" }
        ]
    },
    {
        id: "cyber-001",
        category: "Security",
        title: "Cyber Security",
        icon: <Shield size={24} />,
        banner: "/images/thumbnail_cyber_security_1772185046740.png",
        duration: "5 Months",
        syllabus: [
            { step: "Phase 1: Network Essentials", desc: "TCP/IP, Routing, and Switching.", icon: <Globe />, image: "/images/thumbnail_cyber_security_1772185046740.png" },
            { step: "Phase 2: Ethical Hacking", desc: "Vulnerability Assessment and Penetration Testing.", icon: <Lock />, image: "/images/thumbnail_cyber_security_1772185046740.png" },
            { step: "Phase 3: Digital Forensics", desc: "Malware analysis and incident response.", icon: <Search />, image: "/images/thumbnail_cyber_security_1772185046740.png" }
        ]
    },
    {
        id: "frontend-001",
        category: "Development",
        title: "Frontend Development",
        icon: <Layout size={24} />,
        banner: "/images/thumbnail_react_course_1772179313562.png",
        duration: "3 Months",
        syllabus: [
            { step: "Phase 1: Modern UI", desc: "HTML5, CSS3, Tailwind, and Animations.", icon: <PenTool />, image: "/images/thumbnail_ui_course_1772179344268.png" },
            { step: "Phase 2: JavaScript Deep Dive", desc: "ES6+, DOM Manipulation, and Async JS.", icon: <Code />, image: "/images/thumbnail_react_course_1772179313562.png" },
            { step: "Phase 3: React Architecture", desc: "Component design, state management, and routing.", icon: <Layout />, image: "/images/thumbnail_react_course_1772179313562.png" }
        ]
    },
    {
        id: "uiux-001",
        category: "Design",
        title: "UI/UX Design",
        icon: <PenTool size={24} />,
        banner: "/images/uiux_banner.png",
        duration: "3 Months",
        syllabus: [
            { step: "Phase 1: Design Thinking", desc: "User research and Information Architecture.", icon: <Lightbulb />, image: "/images/uiux_banner.png" },
            { step: "Phase 2: High-Fidelity Prototyping", desc: "Figma mastery, design systems, and interactions.", icon: <Monitor />, image: "/images/uiux_banner.png" }
        ]
    },
    {
        id: "marketing-001",
        category: "Marketing",
        title: "Digital Marketing",
        icon: <TrendingUp size={24} />,
        banner: "/images/hero_digital_marketing_1772198330940.png",
        duration: "3 Months",
        syllabus: [
            { step: "Phase 1: SEO & Content", desc: "Organic growth scaling and keyword strategies.", icon: <Search />, image: "/images/hero_digital_marketing_1772198330940.png" },
            { step: "Phase 2: Performance Marketing", desc: "Google Ads, Meta Ads, and ROI optimization.", icon: <Target />, image: "/images/hero_digital_marketing_1772198330940.png" }
        ]
    },
    {
        id: "bigdata-001",
        category: "Data Science",
        title: "Big Data Architecture",
        icon: <HardDrive size={24} />,
        banner: "/images/datascience_banner.png",
        duration: "6 Months",
        syllabus: [
            { step: "Phase 1: Hadoop Ecosystem", desc: "HDFS, MapReduce, and YARN fundamentals.", icon: <Server />, image: "/images/datascience_banner.png" },
            { step: "Phase 2: Spark & Streaming", desc: "Real-time data processing with Apache Spark and Kafka.", icon: <Zap />, image: "/images/datascience_banner.png" }
        ]
    },
    {
        id: "bitcoin-001",
        category: "Web3",
        title: "Web3 & Blockchain Mastery",
        icon: <Lock size={24} />,
        banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
        duration: "5 Months",
        syllabus: [
            { step: "Phase 1: Blockchain Fundamentals", desc: "Cryptography, Hashing, and P2P Network architecture.", icon: <Shield />, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800" },
            { step: "Phase 2: Ethereum & Solidity", desc: "Smart contract development and EVM internals.", icon: <Code />, image: "https://images.unsplash.com/photo-1622760219088-90c1576336a1?auto=format&fit=crop&q=80&w=800" },
            { step: "Phase 3: DApp Architecture", desc: "Building decentralized frontends with Ethers.js and Web3.js.", icon: <Layout />, image: "https://images.unsplash.com/photo-1642104704074-907c0698bcd9?auto=format&fit=crop&q=80&w=800" },
            { step: "Phase 4: DeFi & Advanced Protocols", desc: "Yield farming, L2 scaling solutions, and NFT standards.", icon: <Zap />, image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800" }
        ]
    },
    {
        id: "mongodb-001",
        category: "Development",
        title: "MongoDB Expert",
        icon: <Database size={24} />,
        banner: "/images/hero_full_stack_web_1772198298591.png",
        duration: "2 Months",
        syllabus: [
            { step: "Phase 1: NoSQL Fundamentals", desc: "Documents, collections, and CRUD operations.", icon: <Database />, image: "/images/hero_full_stack_web_1772198298591.png" },
            { step: "Phase 2: Advanced Aggregation", desc: "Complex queries, indexing, and performance tuning.", icon: <Activity />, image: "/images/hero_full_stack_web_1772198298591.png" }
        ]
    },
    {
        id: "sql-001",
        category: "Development",
        title: "SQL Mastery",
        icon: <Database size={24} />,
        banner: "/images/sql_banner.png",
        duration: "2 Months",
        syllabus: [
            { step: "Phase 1: Relational Design", desc: "Normalization, ERDs, and Schema planning.", icon: <Layers />, image: "/images/sql_banner.png" },
            { step: "Phase 2: Advanced Queries", desc: "Window functions, CTEs, and optimization.", icon: <Search />, image: "/images/sql_banner.png" }
        ]
    },
    {
        id: "dotnet-001",
        category: "Development",
        title: ".NET Enterprise",
        icon: <Layers size={24} />,
        banner: "/images/dotnet_banner.png",
        duration: "5 Months",
        syllabus: [
            { step: "Phase 1: C# & OOPs", desc: "Modern C# capabilities, LINQ, and asynchronous programming.", icon: <Code />, image: "/images/dotnet_banner.png" },
            { step: "Phase 2: ASP.NET Core MVC & APIs", desc: "Building scalable enterprise-grade backend services.", icon: <Server />, image: "/images/dotnet_banner.png" }
        ]
    },
    {
        id: "os-001",
        category: "Core Eng",
        title: "OS Internals",
        icon: <Settings size={24} />,
        banner: "/images/os_banner.png",
        duration: "3 Months",
        syllabus: [
            { step: "Phase 1: Process Management", desc: "Scheduling, IPC, and concurrency control.", icon: <Cpu />, image: "/images/os_banner.png" },
            { step: "Phase 2: Memory & Storage", desc: "Paging, segmentation, and file system architecture.", icon: <HardDrive />, image: "/images/os_banner.png" }
        ]
    },
    {
        id: "data-analytics-001",
        category: "Data Science",
        title: "Data Analytics",
        icon: <LineChart size={24} />,
        banner: "/images/datascience_banner.png",
        duration: "4 Months",
        syllabus: [
            { step: "Phase 1: Data Wrangling", desc: "Cleaning, transforming, and preparing data with Python/Pandas.", icon: <Database />, image: "/images/datascience_banner.png" },
            { step: "Phase 2: Visualization & BI", desc: "Tableau, PowerBI, and storytelling with data.", icon: <BarChart />, image: "/images/datascience_banner.png" }
        ]
    },
    {
        id: "ai-001",
        category: "Data Science",
        title: "Artificial Intelligence",
        icon: <Bot size={24} />,
        banner: "/images/ai_banner.png",
        duration: "6 Months",
        syllabus: [
            { step: "Phase 1: AI Foundations", desc: "Search algorithms, heuristics, and knowledge representation.", icon: <Brain />, image: "/images/ai_banner.png" },
            { step: "Phase 2: NLP & Generative AI", desc: "LLMs, Transformers, and building AI agents.", icon: <Bot />, image: "/images/ai_banner.png" }
        ]
    },
    {
        id: "ml-001",
        category: "Data Science",
        title: "Machine Learning",
        icon: <Cpu size={24} />,
        banner: "/images/ai_banner.png",
        duration: "5 Months",
        syllabus: [
            { step: "Phase 1: Statistical Learning", desc: "Regression, classification, logic models.", icon: <Target />, image: "/images/ai_banner.png" },
            { step: "Phase 2: Ensemble & Deep Learning", desc: "Random forests, XGBoost, and neural networks overview.", icon: <Network />, image: "/images/ai_banner.png" }
        ]
    }
];

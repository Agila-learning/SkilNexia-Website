import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    PlayCircle, Play, Award, Users, BookOpen, ArrowRight, Zap, Target, Star,
    ChevronLeft, ChevronRight, Globe, Code, Database, Cpu, Menu, X,
    ArrowUp, CheckCircle, Shield, Briefcase, ChevronDown, Rocket, Search,
    Smartphone, PenTool, BarChart, Terminal, Heart, Lightbulb, TrendingUp, Bot, Sparkles
} from 'lucide-react';

import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';
import api from '../services/api';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [];

const PARTNER_COMPANIES = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
];

const FAQS = [
    { q: "Do I need prior coding experience?", a: "No, our programs start from the absolute basics and progressively build your skills towards advanced concepts." },
    { q: "Is placement guaranteed?", a: "We provide 100% placement assistance, including dedicated career coaching, mock interviews, and direct referrals to our 500+ hiring partners." },
    { q: "Can I pay in installments?", a: "Yes, we offer flexible EMI options up to 12 months with 0% interest for eligible candidates." },
    { q: "Will I get a certificate?", a: "Yes, upon successful completion of the course and assignments, you will receive an industry-recognized digital certificate." }
];

const MASTERY_STEPS = [
    {
        title: "01. Choose Your Roadmap",
        desc: "Select a specialized career path curated by industry veterans. Whether it's AI, Full Stack, or Cyber Security, we have a premium roadmap for you.",
        icon: <Target size={48} />,
        bg: "bg-slate-950",
        accent: "text-accent-500",
        skills: ["Career Discovery", "Skill Mapping", "Market Analysis"],
        btnText: "Explore All Maps",
        btnLink: "/courses"
    },
    {
        title: "02. Master Through Projects",
        desc: "Move beyond theory. Build real-world enterprise applications that simulate actual work environments. 100% Practical. 100% Professional.",
        icon: <Code size={48} />,
        bg: "bg-primary-900",
        accent: "text-emerald-400",
        skills: ["Agile Workflow", "Clean Code", "CI/CD Pipeline"],
        btnText: "View Curriculum",
        btnLink: "/programs"
    },
    {
        title: "03. 1-on-1 Mentorship",
        desc: "Get direct access to mentors working at top-tier tech companies. Weekly doubt sessions and code reviews to ensure you never get stuck.",
        icon: <Users size={48} />,
        bg: "bg-slate-900",
        accent: "text-blue-400",
        skills: ["Code Review", "Weekly Sync", "Interview prep"],
        btnText: "Meet the Mentors",
        btnLink: "/about"
    },
    {
        title: "04. Global Certification",
        desc: "Earn an industry-recognized certificate that validates your expertise. Share it with potential employers and stand out in the global tech market.",
        icon: <Award size={48} />,
        bg: "bg-black",
        accent: "text-accent-500",
        skills: ["Skill Validation", "Profile Audit", "Hiring Network"],
        btnText: "Learn About Certification",
        btnLink: "/programs"
    }
];

const TUTORIAL_PHRASES = [
    "Exploring Advanced React Patterns...",
    "Compiling Node.js Microservices...",
    "Deploying Docker Containers...",
    "Applying Cyber Security Protocols...",
    "Training Machine Learning Models..."
];

// Natively built Framer Motion SVG Cartoon Teacher to guarantee 100% uptime and zero loading issues.
// Professional Dashboard Preview Component
const DashboardPreview = () => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full h-full relative group"
    >
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl glass-card-premium">
            <img 
                src="/images/dashboard_preview.png" 
                alt="Skilnexia Platform Preview" 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        </div>
        
        {/* Floating Mini Badges for Context */}
        <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 glass-card-premium border-blue-500/30 shadow-xl hidden lg:block"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <CheckCircle size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Job Ready</p>
                    <p className="text-xs font-bold text-white">Curriculum Verified</p>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const Home = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isExpertOpen, setIsExpertOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [currentPhrase, setCurrentPhrase] = useState(0);

    const stackRef = useRef(null);

    useEffect(() => {
        // Subtitle loop
        const timer = setInterval(() => {
            setCurrentPhrase((prev) => (prev + 1) % TUTORIAL_PHRASES.length);
        }, 3000);

        const ctx = gsap.context(() => {
            // 1. Text Reveal Stagger
            gsap.fromTo('.stagger-reveal',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
            );

            // 2. Terminal Window Reveal
            gsap.fromTo('.terminal-popup',
                { scale: 0.9, opacity: 0, y: 50 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.5, 
                    ease: "elastic.out(1, 0.75)",
                    delay: 0.5
                }
            );

            // 3. Floating Motion: Chips & Mini Icons
            gsap.to('.float-loop', {
                y: -10,
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

            // 4. Scroll Reveals for cards
            gsap.utils.toArray('.reveal-up').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                });
            });

            // 5. Mastery Path Hover Interactions
            const cards = gsap.utils.toArray('.mastery-card');
            cards.forEach((card, i) => {
                if (i !== cards.length - 1) {
                    gsap.to(card, {
                        scale: 0.95,
                        opacity: 0.5,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 10%',
                            endTrigger: cards[i + 1],
                            end: 'top 10%',
                            scrub: true,
                        }
                    });
                }
            });
        });
        return () => {
            ctx.revert();
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/reviews/all');
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, []);

    const isUserMessage = TUTORIAL_PHRASES[currentPhrase].startsWith("User:");

    return (
        <div className="bg-[#020617] text-white font-sans overflow-x-hidden pt-10">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <ConsultationModal isOpen={isExpertOpen} onClose={() => setIsExpertOpen(false)} />

            {/* HERO BACKGROUND GRADIENT */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/20 via-slate-950 to-slate-950 border-white/5"></div>
                <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* 1. Career-Focused Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Info: Content Focused */}
                    <div className="space-y-8 text-center lg:text-left relative z-10">
                        <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                            <Rocket size={14} /> Higher Education for Better Careers
                        </div>
                        
                        <div className="space-y-6">
                            <h1 className="fade-up leading-[1.05]">
                                Upgrade your <br />
                                <span className="text-brand-gradient">career with job-ready</span> skills
                            </h1>
                            <p className="fade-up text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                Master high-demand tech skills with our industry-led programs and get placed at top-tier companies. Learn from world-class experts.
                            </p>
                        </div>

                        {/* Integrated Hero Search Bar */}
                        <div className="fade-up hero-search-container group max-w-lg lg:max-w-none">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="What do you want to learn today?" 
                                className="hero-search-input font-medium"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 hidden sm:block">
                                Search
                            </button>
                        </div>

                        <div className="fade-up flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <button onClick={() => setIsRegisterOpen(true)} className="btn-premium flex items-center gap-2 group">
                                Explore Courses <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => setIsExpertOpen(true)} className="btn-premium-outline">
                                Book Free Demo
                            </button>
                        </div>

                        {/* Trust Indicators in Hero */}
                        <div className="fade-up flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-white/5">
                            {[
                                { val: "50,000+", label: "Learners" },
                                { val: "500+", label: "Hiring Partners" },
                                { val: "45 LPA", label: "Highest CTC" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-2xl font-bold text-white leading-none">{item.val}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Premium Platform Preview */}
                    <div className="relative fade-up lg:block">
                        <DashboardPreview />
                        
                        {/* Background structural rings for depth */}
                        <div className="absolute -inset-20 border border-white/5 rounded-full scale-110 opacity-30 border-dashed animate-[spin_60s_linear_infinite]"></div>
                        <div className="absolute -inset-10 border border-blue-500/10 rounded-full scale-90 animate-[spin_40s_linear_infinite_reverse]"></div>
                    </div>
                </div>
            </section>


            {/* 2. Mastery Path: The Journey */}
            <section ref={stackRef} className="py-24 lg:py-40 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 space-y-4">
                        <div className="reveal-up inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.3em] text-blue-400 uppercase">
                            <Target size={14} /> Path to Excellence
                        </div>
                        <h2 className="reveal-up font-poppins font-bold tracking-tight">
                            The <span className="text-brand-gradient">Mastery</span> Path.
                        </h2>
                    </div>

                    <div className="space-y-[30vh]">
                        {MASTERY_STEPS.map((step, idx) => (
                            <div key={idx} className="mastery-card w-full max-w-5xl mx-auto opacity-100">
                                <div className={`relative ${step.bg || 'bg-slate-900'} glass-card-premium p-12 md:p-24 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col justify-center`}>
                                    {/* Decorative subtle glow */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-3xl md:text-5xl font-bold tracking-tight">{step.title}</h3>
                                            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">{step.desc}</p>
                                            
                                            {/* Skill Chips */}
                                            <div className="flex flex-wrap gap-2 pt-4">
                                                {step.skills?.map((skill, si) => (
                                                    <span key={si} className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-6">
                                                <Link to={step.btnLink || '/courses'} className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 w-fit">
                                                    {step.btnText} <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="hidden md:block md:col-span-4 text-center opacity-5">
                                            <div className="text-[180px] font-bold leading-none">{idx + 1}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Stats Section: Futuristic Hub Counters */}
            <section className="py-32 relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                    {[
                        { label: "Elite Members", value: 50, suffix: "K+", sub: "Success Stories", icon: <Users size={32} /> },
                        { label: "Company Reach", value: 500, suffix: "+", sub: "Hiring Partners", icon: <Globe size={32} /> },
                        { label: "Highest CTC", value: 45, suffix: "LPA", sub: "Dream Offers", icon: <Zap size={32} /> },
                        { label: "Average Hike", value: 150, suffix: "%", sub: "Salary Surge", icon: <TrendingUp size={32} /> }
                    ].map((stat, i) => (
                        <div key={i} className="reveal-up group flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 transition-all duration-500">
                                {stat.icon}
                            </div>
                            <div className="space-y-1">
                                <div className="text-5xl font-bold tracking-tight text-white">
                                    {stat.value}{stat.suffix}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Domain Mastery: Cartoon Roadmap Grid */}
            <section className="py-24 lg:py-40 relative overflow-hidden bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <div className="reveal-up inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.3em] text-blue-400 uppercase">
                                <Rocket size={14} /> Future Ready Skills
                            </div>
                            <h2 className="reveal-up font-poppins font-bold tracking-tight">
                                Explore <span className="text-brand-gradient">Learning</span> Maps.
                            </h2>
                        </div>
                        <Link to="/courses" className="reveal-up text-sm font-bold uppercase tracking-widest text-slate-500 border-b-2 border-blue-500 pb-2 hover:text-white transition-all">
                            View All Roadmaps
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {COURSE_CATEGORIES.slice(0, 8).map((cat, idx) => (
                            <Link key={idx} to={`/courses/${cat.id}`} className="reveal-up group">
                                <div className="h-full glass-card-premium p-10 border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white group-hover:bg-blue-600 transition-all duration-500 mb-8">
                                        <div className="w-8 h-8">{cat.icon}</div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold tracking-tight">{cat.title}</h3>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Enroll Open</p>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        Open Roadmap <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Visionary Section: Feature Spotlight */}
            <section className="py-24 lg:py-40 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="glass-card-premium p-12 md:p-32 relative overflow-hidden flex flex-col lg:flex-row items-center gap-24 border border-white/5">
                        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="lg:w-1/2 space-y-12 relative z-10 text-center lg:text-left">
                            <div className="reveal-up space-y-4">
                                <h3 className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em]">Global Standards</h3>
                                <h2 className="text-white leading-tight tracking-tight">Bridge the <br /><span className="text-brand-gradient">Expertise Gap.</span></h2>
                            </div>
                            <p className="reveal-up text-lg font-medium text-slate-400 leading-relaxed border-l-2 border-blue-600 pl-8 mx-auto lg:mx-0 max-w-2xl">
                                "We are an engine of transformation for those who dare to master the modern enterprise stack."
                            </p>
                            <div className="reveal-up pt-6 flex justify-center lg:justify-start">
                                <button onClick={() => setIsRegisterOpen(true)} className="btn-premium">
                                    Join the Elite
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative z-10 w-full">
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: "Job-Ready", text: "Enterprise grade curriculum.", icon: <Rocket className="text-blue-400" /> },
                                        { label: "1:1 Sync", text: "Direct expert mentorship.", icon: <Users className="text-indigo-400" /> },
                                        { label: "Global Ops", text: "Future-proof networking.", icon: <Globe className="text-blue-400" /> },
                                        { label: "Placement", text: "End-to-end transition.", icon: <Briefcase className="text-indigo-400" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="reveal-up bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all space-y-4 group">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {item.icon}
                                            </div>
                                            <h4 className="text-lg font-bold tracking-tight">{item.label}</h4>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Alumni Reach: Pill Container Grid */}
            <section className="py-24 relative overflow-hidden border-y border-white/5 bg-slate-900/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="reveal-up font-poppins font-bold tracking-tight">Alumni <span className="text-brand-gradient">Success.</span></h2>
                        <p className="reveal-up text-slate-500 font-bold uppercase tracking-widest text-[9px]">Engineering careers at the world's most innovative tech giants</p>
                    </div>
                    
                    <div className="reveal-up glass-card-premium rounded-full py-10 px-20 border border-white/5 overflow-hidden">
                        <div className="flex w-max gap-20 animate-scroll-left hover:[animation-play-state:paused] transition-all items-center">
                            {[...PARTNER_COMPANIES, ...PARTNER_COMPANIES].map((company, i) => (
                                <div key={i} className="shrink-0 grayscale invert opacity-50 hover:grayscale-0 hover:invert-0 hover:opacity-100 hover:scale-110 transition-all duration-500">
                                    <img src={company.logo} alt={company.name} className="h-8 md:h-12 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Student Stories: Glass Cards */}
            <section className="py-32 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="reveal-up font-poppins font-bold tracking-tight">Success <span className="text-brand-gradient">Stories.</span></h2>
                        <div className="reveal-up flex justify-center gap-1 text-blue-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loadingReviews ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-80 bg-white/5 animate-pulse rounded-2xl"></div>
                            ))
                        ) : reviews.length > 0 ? (
                            reviews.slice(0, 6).map((t) => (
                                <div key={t._id} className="reveal-up group h-full">
                                    <div className="h-full glass-card-premium p-10 border border-white/5 hover:border-blue-500/20 transition-all duration-500 flex flex-col">
                                        <div className="mb-8 w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 bg-slate-900 flex items-center justify-center">
                                            {t.user?.profileImage ? (
                                                <img src={t.user.profileImage} alt={t.user?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-white uppercase tracking-tight">
                                                    {t.user?.name?.charAt(0) || 'S'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 font-medium italic leading-relaxed mb-10">"{t.comment}"</p>
                                        <div className="mt-auto">
                                            <h4 className="text-lg font-bold text-white tracking-tight">{t.user?.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-4 h-0.5 bg-blue-500 rounded-full"></span>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Verified Student</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 glass-card-premium border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <Users size={48} className="text-slate-700 mb-6" />
                                <h4 className="text-2xl font-bold text-white tracking-tight">Our Community is Growing</h4>
                                <p className="text-slate-500 font-medium mt-2">More stories being mapped. Join us today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 8. Knowledge Base: Accordion */}
            <section className="py-32 relative overflow-hidden bg-slate-900/20">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="reveal-up font-poppins font-bold tracking-tight text-white">Common <span className="text-brand-gradient">Questions.</span></h2>
                        <p className="reveal-up text-slate-500 font-bold uppercase tracking-widest text-[9px] italic">Everything you need to know about your growth.</p>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`reveal-up rounded-2xl border transition-all duration-500 ${activeFaq === i ? 'bg-white border-transparent' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 text-left"
                                >
                                    <span className={`text-lg font-bold tracking-tight ${activeFaq === i ? 'text-slate-950' : 'text-white'}`}>{faq.q}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-slate-900 text-white rotate-180' : 'bg-white/10 text-white'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                <div className={`transition-all duration-700 ease-in-out ${activeFaq === i ? 'max-h-[500px] opacity-100 p-8 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <p className={`text-base font-medium leading-relaxed ${activeFaq === i ? 'text-slate-600' : 'text-slate-400'}`}>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Final CTA: Gradient Engine */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto rounded-[40px] bg-gradient-to-br from-blue-700 to-indigo-900 p-16 md:p-32 text-center relative overflow-hidden group border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[150px] rounded-full animate-float"></div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-none reveal-up">
                                Ignite Your <br />Value.
                            </h2>
                            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto reveal-up">
                                Do not just learn. Build your career footprint with Skilnexia's elite programs.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 reveal-up">
                            <button onClick={() => setIsRegisterOpen(true)} className="btn-premium px-12 py-5 text-xl">
                                Join Now
                            </button>
                            <button onClick={() => setIsExpertOpen(true)} className="btn-premium-outline px-12 py-5 text-xl">
                                Talk to Career Expert
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

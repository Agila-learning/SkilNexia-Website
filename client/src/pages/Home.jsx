import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    PlayCircle, Award, Users, BookOpen, ArrowRight, Zap, Target, Star,
    ChevronLeft, ChevronRight, Globe, Code, Database, Cpu, Menu, X,
    ArrowUp, CheckCircle, Shield, Briefcase, ChevronDown, Rocket,
    Smartphone, PenTool, BarChart, Terminal, Heart, Lightbulb, TrendingUp, Bot, Sparkles
} from 'lucide-react';

import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';
import api from '../services/api';

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
    "Ready to master Kubernetes? I'll guide you step-by-step.",
    "Let's visualize the cluster architecture first...",
    "User: How do I scale deployments?",
    "That's easy! Watch me apply the scaling policy...",
    "Success! Your application footprint is now scaled."
];

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

            {/* AI HUB BACKGROUND EFFECT */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* 1. AI Assistant Teaching Hero */}
            <section className="relative min-h-screen flex items-center justify-center py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Left Info & Chat Meta */}
                    <div className="lg:col-span-5 space-y-10 text-center lg:text-left relative z-10">
                        <div className="stagger-reveal inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black tracking-widest text-cyan-400 uppercase">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Live Training Active
                        </div>
                        <h1 className="stagger-reveal text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">
                            LEARN WITH <br />
                            <span className="neon-blue">AI TUTOR.</span>
                        </h1>
                        
                        {/* Simulated Live Chat */}
                        <div className="stagger-reveal space-y-4 max-w-sm mx-auto lg:mx-0">
                            <div className={`chat-bubble transition-all duration-500 ${isUserMessage ? 'chat-bubble-user scale-100' : 'opacity-40 scale-95'}`}>
                                <p>How do I get started?</p>
                            </div>
                            <div className={`chat-bubble transition-all duration-500 ${!isUserMessage ? 'chat-bubble-ai scale-100 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'opacity-40 scale-95'}`}>
                                <div className="flex gap-1 mb-2">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot" style={{animationDelay: '0.2s'}}></div>
                                    <div className="typing-dot" style={{animationDelay: '0.4s'}}></div>
                                </div>
                                <p className="leading-relaxed">{TUTORIAL_PHRASES[currentPhrase].replace("User: ", "")}</p>
                            </div>
                        </div>

                        <div className="stagger-reveal flex flex-wrap justify-center lg:justify-start gap-4 pt-6">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-10 py-5 bg-white text-slate-950 rounded-[30px] font-black text-lg hover:bg-cyan-400 transition-colors shadow-2xl active:scale-95 uppercase tracking-widest border-b-4 border-slate-200">
                                Enroll Now
                            </button>
                            <button onClick={() => setIsExpertOpen(true)} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[30px] font-black text-lg hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest">
                                Book Demo
                            </button>
                        </div>
                    </div>

                    {/* Right: Teaching Terminal */}
                    <div className="lg:col-span-7 relative">
                        <div className="terminal-popup terminal-window relative z-10 border-4 border-white/5">
                            <div className="scan-line"></div>
                            
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-b border-white/10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Simulation v2.0</div>
                            </div>

                            {/* Main Display */}
                            <div className="relative aspect-video overflow-hidden">
                                <img 
                                    src="/images/dashboard-mockup.png" 
                                    alt="Learning Dashboard" 
                                    className="w-full h-full object-cover opacity-60 scale-105"
                                />
                                
                                {/* The AI Avatar */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 avatar-float flex items-center justify-center">
                                    <div className="relative">
                                        <img 
                                            src="/images/ai-avatar.png" 
                                            alt="AI Assistant" 
                                            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(34,211,238,0.4)]"
                                        />
                                        {/* Audio Wave Simulation */}
                                        {!isUserMessage && (
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 h-6">
                                                {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="w-1 bg-cyan-400 rounded-full animate-pulse" 
                                                        style={{ height: `${h * 20}%`, animationDelay: `${i * 0.1}s` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Interactive Overlay Tags */}
                                <div className="float-loop absolute top-1/4 left-1/4 px-4 py-2 bg-cyan-500 text-slate-950 font-black text-[10px] rounded-lg tracking-widest shadow-2xl">
                                    POD.YAML
                                </div>
                                <div className="float-loop absolute bottom-1/4 right-1/4 px-4 py-2 bg-purple-500 text-white font-black text-[10px] rounded-lg tracking-widest shadow-2xl" style={{animationDelay: '1s'}}>
                                    SCALING...
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration Nodes */}
                        <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full z-0"></div>
                        <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full z-0"></div>
                    </div>
                </div>
            </section>


            {/* 2. Mastery Path: The Journey */}
            <section ref={stackRef} className="py-24 lg:py-40 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32 space-y-4">
                        <div className="reveal-up inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">
                            <Target size={14} /> Path to Excellence
                        </div>
                        <h2 className="reveal-up text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                            The <span className="neon-purple">Mastery</span> Path.
                        </h2>
                    </div>

                    <div className="space-y-[30vh]">
                        {MASTERY_STEPS.map((step, idx) => (
                            <div key={idx} className="mastery-card w-full max-w-5xl mx-auto opacity-100">
                                <div className={`relative ${step.bg || 'bg-slate-900'} bubble-soft p-12 md:p-24 border-2 border-white/10 shadow-xl hover:scale-[1.02] hover:glow-border transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col justify-center cartoon-shadow`}>
                                    {/* Decorative glow */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-cyan-400 cartoon-shadow hover:scale-110 transition-transform">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">{step.title}</h3>
                                            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">{step.desc}</p>
                                            
                                            {/* Skill Chips */}
                                            <div className="flex flex-wrap gap-2 pt-4">
                                                {step.skills?.map((skill, si) => (
                                                    <span key={si} className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-6">
                                                <Link to={step.btnLink || '/courses'} className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all cartoon-shadow flex items-center gap-2 w-fit">
                                                    {step.btnText} <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="hidden md:block md:col-span-4 text-center opacity-10">
                                            <div className="text-[200px] font-black leading-none">{idx + 1}</div>
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
                            <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-cyan-400 cartoon-shadow-hover hover:rotate-6 transition-all duration-500">
                                {stat.icon}
                            </div>
                            <div className="space-y-2">
                                <div className="text-6xl font-black tracking-tighter neon-blue">
                                    {stat.value}{stat.suffix}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xs font-bold text-slate-500">{stat.sub}</p>
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
                            <div className="reveal-up inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase">
                                <Rocket size={14} /> Future Ready Skills
                            </div>
                            <h2 className="reveal-up text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                                EXPLORE <br /><span className="neon-blue">ROADMAPS.</span>
                            </h2>
                        </div>
                        <Link to="/courses" className="reveal-up text-sm font-black uppercase tracking-widest text-slate-400 border-b-4 border-cyan-500 pb-2 hover:text-white transition-all">
                            View Deep Dives
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {COURSE_CATEGORIES.slice(0, 8).map((cat, idx) => (
                            <Link key={idx} to={`/courses/${cat.id}`} className="reveal-up group">
                                <div className="h-full glass-dark bubble-soft p-12 border border-white/5 hover:glow-border hover:scale-105 cartoon-shadow transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="w-24 h-24 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 mb-8">
                                        <div className="w-10 h-10">{cat.icon}</div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">{cat.title}</h3>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Enroll Open</p>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        Open Map <ArrowRight size={14} />
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
                    <div className="glass-dark bubble-soft p-12 md:p-32 relative overflow-hidden flex flex-col lg:flex-row items-center gap-24 border border-white/5 cartoon-shadow">
                        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-blue-600/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="lg:w-1/2 space-y-12 relative z-10 text-center lg:text-left">
                            <div className="reveal-up space-y-6">
                                <h3 className="text-cyan-400 text-xs font-black uppercase tracking-[0.4em]">The Architecture</h3>
                                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">Bridge the <br /><span className="neon-blue">Gap.</span></h2>
                            </div>
                            <p className="reveal-up text-xl font-medium text-slate-400 leading-relaxed italic border-l-0 lg:border-l-4 border-cyan-500 pl-0 lg:pl-8 mx-auto lg:mx-0 max-w-2xl">
                                “We're an engine of transformation for those who dare to master the modern enterprise stack.”
                            </p>
                            <div className="reveal-up pt-10 flex justify-center lg:justify-start">
                                <button onClick={() => setIsRegisterOpen(true)} className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all cartoon-shadow active:scale-95">
                                    Join Core
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative z-10 w-full">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Job-Ready", text: "Enterprise grade curriculum.", icon: <Rocket className="text-cyan-400" /> },
                                    { label: "1:1 Sync", text: "Direct expert mentorship.", icon: <Users className="text-purple-400" /> },
                                    { label: "Web3 Ops", text: "Future-proof networking.", icon: <Globe className="text-cyan-400" /> },
                                    { label: "Placement", text: "End-to-end transition.", icon: <Briefcase className="text-purple-400" /> }
                                ].map((item, i) => (
                                    <div key={i} className="reveal-up bg-white/5 p-8 rounded-[40px] border border-white/5 hover:border-white/20 transition-all space-y-4 group cartoon-shadow-hover">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-black uppercase tracking-tight">{item.label}</h4>
                                        <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.text}</p>
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
                        <h2 className="reveal-up text-4xl md:text-6xl font-black tracking-tighter uppercase">ALUMNI <span className="neon-blue">REACH.</span></h2>
                        <p className="reveal-up text-slate-500 font-black uppercase tracking-widest text-[10px]">Engineering careers at the world's most innovative tech giants</p>
                    </div>
                    
                    <div className="reveal-up glass-dark rounded-full py-12 px-20 border border-white/5 overflow-hidden">
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
                        <h2 className="reveal-up text-4xl md:text-6xl font-black tracking-tighter uppercase">SUCCESS <span className="neon-purple">HUB.</span></h2>
                        <div className="reveal-up flex justify-center gap-1 text-cyan-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loadingReviews ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-80 bg-white/5 animate-pulse bubble-soft"></div>
                            ))
                        ) : reviews.length > 0 ? (
                            reviews.slice(0, 6).map((t) => (
                                <div key={t._id} className="reveal-up group h-full">
                                    <div className="h-full glass-dark bubble-soft p-12 border border-white/5 group-hover:glow-border cartoon-shadow-hover transition-all duration-500 flex flex-col">
                                        <div className="mb-10 w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/10 cartoon-shadow bg-slate-900 flex items-center justify-center">
                                            {t.user?.profileImage ? (
                                                <img src={t.user.profileImage} alt={t.user?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-black text-white uppercase tracking-tighter">
                                                    {t.user?.name?.charAt(0) || 'S'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 font-medium italic leading-relaxed mb-12">"{t.comment}"</p>
                                        <div className="mt-auto">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight">{t.user?.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-4 h-0.5 bg-cyan-400 rounded-full"></span>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Verified Architect</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 glass-dark bubble-soft border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <Users size={48} className="text-slate-700 mb-6" />
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Our Community is Growing</h4>
                                <p className="text-slate-500 font-medium mt-2">More stories being mapped. Join the elite elite today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 8. Knowledge Base: Accordion */}
            <section className="py-32 relative overflow-hidden bg-slate-900/20">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="reveal-up text-5xl font-black tracking-tighter uppercase">CORE <span className="neon-blue">FAQS.</span></h2>
                        <p className="reveal-up text-slate-500 font-black uppercase tracking-widest text-xs italic">Everything you need to know about your evolution.</p>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`reveal-up bubble-soft border transition-all duration-500 ${activeFaq === i ? 'bg-white border-transparent' : 'glass-dark border-white/5 hover:bg-white/5'}`}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 md:p-10 text-left"
                                >
                                    <span className={`text-xl font-black uppercase tracking-tighter ${activeFaq === i ? 'text-slate-950' : 'text-white'}`}>{faq.q}</span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-slate-900 text-white rotate-180' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </button>
                                <div className={`transition-all duration-700 ease-in-out ${activeFaq === i ? 'max-h-[500px] opacity-100 p-10 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <p className={`text-lg font-medium leading-relaxed ${activeFaq === i ? 'text-slate-600' : 'text-slate-400'}`}>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Final CTA: Gradient Engine */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto bubble-soft bg-gradient-to-br from-blue-600 to-purple-700 p-16 md:p-32 text-center relative overflow-hidden group cartoon-shadow border-4 border-white/10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[150px] rounded-full animate-float"></div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] reveal-up">
                                SCALE YOUR <br />VALUE.
                            </h2>
                            <p className="text-white/80 text-xl md:text-2xl font-medium max-w-2xl mx-auto reveal-up">
                                Don't just learn. Build your footprint with Skilnexia's elite mentorship.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 reveal-up">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-16 py-6 bg-white text-slate-950 rounded-[30px] font-black text-xl hover:scale-110 transition-transform cartoon-shadow active:scale-95 uppercase tracking-widest border-b-4 border-slate-200">
                                Enroll Now
                            </button>
                            <button onClick={() => setIsExpertOpen(true)} className="px-16 py-6 bg-slate-950/20 border border-white/20 text-white rounded-[30px] font-black text-xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest">
                                Speak to Expert
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
